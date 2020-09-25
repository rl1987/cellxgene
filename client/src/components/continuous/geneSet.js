import React, { Component } from "react";
import { connect } from "react-redux";
import _ from "lodash";

import actions from "../../actions";
import HistogramBrush from "../brushableHistogram";

@connect((state) => {
  return {
    accessCode: state.geneSet?.accessCode,
    datasetTitle: state.config?.displayNames?.dataset,
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
    const { datasetTitle, accessCode: newCode = "", dispatch } = this.props;
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
      // eslint-disable-next-line react/no-did-update-set-state -- properly checked but should be get derived state from props
      this.setState({ genes, title });

      dispatch({ type: "gene set start" });

      Promise.all(
        genes.map((gene) => {
          return dispatch(actions.requestGeneSet(gene));
        })
      ).then(
        () => dispatch({ type: "gene set defined complete" }),
        () => dispatch({ type: "gene set defined error" })
      );
    }
  }

  render() {
    const { genes, title } = this.state;

    return (
      <div>
        <h3 style={{ textAlign: "center" }}>{title}</h3>
        {genes.length > 0
          ? _.map(genes, (geneName, index) => {
              console.log(geneName);

              return (
                <div key={geneName}>
                  <HistogramBrush
                    key={geneName}
                    field={geneName}
                    zebra={index % 2 === 0}
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
export default GeneSet;
