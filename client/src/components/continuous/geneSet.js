import React, { Component } from "react";
import { connect } from "react-redux";
import _ from "lodash";

import actions from "../../actions";
import HistogramBrush from "../brushableHistogram";

export default
@connect((state) => {
  return {
    accessCode: state.geneSet?.accessCode,
    datasetTitle: state.config?.displayNames?.dataset,
    world: state.world,
    geneSet: state.controls.geneSet,
    geneSetLoading: state.controls.geneSetLoading,
  };
})
class GeneSet extends Component {
  constructor(props) {
    super(props);

    this.state = {
      title: "",
      genes: [],
    };
  }

  async componentDidUpdate(prevProps, prevState) {
    Object.entries(this.props).forEach(
      ([key, val]) =>
        prevProps[key] !== val && console.log(`Prop '${key}' changed`)
    );
    if (this.state) {
      Object.entries(this.state).forEach(
        ([key, val]) =>
          prevState[key] !== val && console.log(`State '${key}' changed`)
      );
    }
    const {
      datasetTitle,
      accessCode: newCode = "",
      world,
      dispatch,
    } = this.props;
    if (prevProps.accessCode !== newCode) {
      const query = `{
        geneSets(dataset: "${datasetTitle}", accessCode: "${newCode}") {
          title
          genes
        }
      }`;
      const response = await (
        await fetch("http://localhost:4000/graphql", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
          },
          body: JSON.stringify({ query }),
        })
      ).json();
      const { genes, title } = response.data.geneSets[0];
      this.setState({ genes, title });
      const varIndexName = world.schema.annotations.var.index;
      const worldGenes =
        world.varAnnotations?.col(varIndexName)?.asArray() || [];

      dispatch({ type: "gene set start" });

      Promise.all(
        genes.map((gene) => {
          const indexOfGene = worldGenes.indexOf(gene);

          return dispatch(actions.requestGeneSet(worldGenes[indexOfGene]));
        })
      ).then(
        () => dispatch({ type: "gene set defined complete" }),
        () => dispatch({ type: "gene set defined error" })
      );
    }
  }

  render() {
    const { genes, title } = this.state;
    const { world } = this.props;

    return (
      <div>
        <h3 style={{ textAlign: "center" }}>{title}</h3>
        {world && genes.length > 0
          ? _.map(genes, (geneName, index) => {
              console.log(geneName);

              const values = world.varData.col(geneName);
              if (!values) {
                return null;
              }
              const summary = values.summarize();
              return (
                <div data-random="YES">
                  <HistogramBrush
                    key={geneName}
                    field={geneName}
                    zebra={index % 2 === 0}
                    ranges={summary}
                    isUserDefined
                  />
                </div>
              );
            })
          : null}
      </div>
    );
  }
}
