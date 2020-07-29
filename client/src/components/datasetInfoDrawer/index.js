import React from "react";
import { connect } from "react-redux";

import { Drawer } from "@blueprintjs/core";

@connect((state) => {
  return {
    config: state.config,
    visible: state.controls.datasetInfoDrawerVisible,
  };
})
class DatasetInfoDrawer extends React.PureComponent {
  onClose = () => {
    const { dispatch } = this.props;
    dispatch("toggle dataset info drawer");
  };

  render() {
    const { config, visible } = this.props;
    console.log(config);

    return (
      <Drawer
        autoFocus="true"
        canEscapeKeyClose="true"
        canOutsideClickClose="true"
        enforceFocus="true"
        hasBackdrop="true"
        isOpen={visible}
        position=" PositionRIGHT"
        size="45em"
        usePortal="true"
        title="Dataset Overview"
      >
        <div
          style={{
            padding: 20,
          }}
        >
          <h1 style={{ fontSize: 36 }}>
            A molecular cell atlas of the human lung from single cell RNA
            sequencing
          </h1>
          <h3 style={{ fontSize: 18 }}>Authors</h3>
          <p style={{ fontSize: 14 }}>
            Kyle J. Travaglini, Ahmad N. Nabhan, Lolita Penland, Rahul Sinha,
            Astrid Gilli,ch Rene V. Sit, Stephen Chang, Stephanie D. Conley,
            Yasuo Mori, Jun Seita, Gerald J. Berry, Joseph B. Shrager, Ross J.
            Metzger, Christin S. Kuo, Norma Neff, Irving L. Weissman, Stephen R.
            Quake, Mark A. Krasnow
          </p>
          <h3 style={{ fontSize: 18 }}>DOI</h3>
          <p style={{ fontSize: 14 }}>https://doi.org/10.1101/742320</p>
          <h3 style={{ fontSize: 18 }}>Comments</h3>
          <p style={{ fontSize: 14 }}>
            Tissue was collected from patients undergoing lobectomy for focal
            lung tumors, but normal tissue was obtained from uninvolved regions
            of the lung.
          </p>
          <h3 style={{ fontSize: 18 }}>Dataset Metadata</h3>
          <p style={{ fontSize: 14 }}>Organism: Homo Sapiens</p>
          <p style={{ fontSize: 14 }}>Disease: null</p>
        </div>
      </Drawer>
    );
  }
}

export default DatasetInfoDrawer;

/* 

"corpora_props": {
      "contributors": [
        {
          "email": "nh3@sanger.ac.uk", 
          "institution": "Sanger Institute", 
          "name": "Ni Huang"
        }
      ], 
      "layer_descriptions": {
        "X": "cell ranger 2"
      }, 
      "organism": "Homo sapiens", 
      "organism_ontology_term_id": "NCBITaxon:9606", 
      "project_description": "The thymus provides a nurturing environment for the differentiation and selection of T cells, a process orchestrated by their interaction with multiple thymic cell types. We used single-cell RNA sequencing to create a cell census of the human thymus across the life span and to reconstruct T cell differentiation trajectories and T cell receptor (TCR) recombination kinetics. Using this approach, we identified and located in situ CD8\u03b1\u03b1+ T cell populations, thymic fibroblast subty and activated dendritic cell states. In addition, we reveal a bias in TCR recombination a selection, which is attributed to genomic position and the kinetics of lineage commitment. Taken together, our data provide a comprehensive atlas of the human thymus across the life span with new insights into human T cell development.\n", 
      "project_links": [
        {
          "link_name": "ArrayExpress", 
          "link_type": "RAW_DATA", 
          "link_url": "https://www.ebi.ac.uk/arrayexpress/experiments/E-MTAB-8581/"
        }, 
        {
          "link_name": "Development Cell Atlas", 
          "link_type": "OTHER", 
          "link_url": "https://developmentcellatlas.ncl.ac.uk/"
        }, 
        {
          "link_name": "Development Cell Atlas", 
          "link_type": "SUMMARY", 
          "link_url": "https://developmentcellatlas.ncl.ac.uk/"
        }
      ], 
      "project_name": "A cell atlas of human thymic development defines T cell repertoire formation", 
      "publication_doi": "https://doi.org/10.1126/science.aay3224", 
      "title": "A cell atlas of human thymic development defines T cell repertoire formation", 
      "version": {
        "corpora_encoding_version": "0.2.0", 
        "corpora_schema_version": "1.0.0"
      }
    }, 

*/
