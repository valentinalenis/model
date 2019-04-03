import React, {
    Component
} from 'react';
import './App.css';
import MainView from './MainView/mainView';
import {
    BrowserRouter
} from 'react-router-dom';
import axios from 'axios';
import Modeler from '../modeler';
import PropertiesPanel from '../properties-panel';
import reducedPaletteModule from '../modeler/features/reduced-palette';
import reducedContextPadModule from '../modeler/features/reduced-context-pad';
import customModdleExtension from '../modeler/moddle/custom.json';
//import Administrator from '../containers/Administrator/administrator';
import {
    download
} from '../util';
//import ReactDOM from 'react-dom';
import diagramXML from '../diagram.bpmn';
//axios.defaults.baseURL = 'http://localhost:3002/';

const Administrator = require ('../containers/Administrator/administrator');
var ReactDOM = require ( 'react-dom' );
const $admin = document.querySelector('#admin');
const $graph = document.querySelector('#graph');
const $yo = document.querySelector('#yo');

$admin.addEventListener('click', function () {

    state = {
        openModal: false,
        models: [],
        selectedNode: {
            name: "",
            description: "",
            activities: []
        },
        showPopUp: false,
        selectedActivity: {
            name: '',
            description: '',
            objective: '',
        }
    };


    addClickHandler = () => {
        console.log("Add");
        this.setState($yo);
    }

    editClickHandler = () => {
        console.log("Edit");
        this.setState({openModal: true});
    }

    deleteClickHandler = () => {
        console.log("delete");
    }

    closeModal = () => {
        this.setState({
            openModal: false,
            models: []
        });
        this.getAllModels();
    }

    componentDidMount = () => {
        if(!this.state.models.length){
            this.getAllModels();
        }
    }

    /**
     * Obtiene todos los modelos creados
     */
    getAllModels = () => {
        Axios.get('getAllModels')
        .then(response => {
            console.log(response.data);
            const models = response.data;
            models.forEach(i => {
                i.selected = false;
            });
            this.setState({models: response.data});
        });
    }

    /**
     * Evento de click del árbol de modelos
     */
    nodeClick = (event, nodeId) => {
        const id = {id: nodeId};
        this.selectedNode(nodeId);
        Axios.post('getModelById', id)
        .then(response => {
            console.log(response.data);
            const data = response.data;
            this.setState({selectedNode: data});
        });
    }

    /**
     * Método que selecciona el nodo
     */
    selectedNode = id => {
        const newModel = [...this.state.models];
        newModel.forEach(i => {
            if(i._id === id){
                i.selected = true;
            }else{
                i.selected = false;
            }
        });
        this.setState({models: newModel});
    }

    /**
     * Método encargado de cerrar el pop up de información de la actividad seleccionada
     */
    closePopUp = () => {
        this.setState({
            showPopUp: false
        });
    }

    /**
     * Método encargado de abrir el pop up con la información de la actividad seleccionada
     */
    openPopUp = id => {
        const toSendObj = {
            id: id
        }
        Axios.post(this.props.url, toSendObj)
        .then((response) => {
            const data = response.data;
            const selectedActivityData  = {
                name: data.name,
                description: data.description,
                objective: data.objective,
            }
            this.setState({
                showPopUp: true, selectedActivity: selectedActivityData
            });
        });
    }
});


$graph.addEventListener('click', function () {

    const $modelerContainer = document.querySelector('#modeler-container');
    const $propertiesContainer = document.querySelector('#properties-container');
    const $downloadButton = document.querySelector('#download-diagram');

    const modeler = new Modeler({
        container: $modelerContainer,
        additionalModules: [
            reducedContextPadModule,
            reducedPaletteModule
        ],
        moddleExtensions: {
            custom: customModdleExtension
        },
        keyboard: {
            bindTo: document.body

        }
    });

    const propertiesPanel = new PropertiesPanel({
        container: $propertiesContainer,
        modeler

    });

    modeler.importXML(diagramXML);

    $downloadButton.addEventListener('click', function () {

        modeler.saveXML({
            format: true
        }, function (err, xml) {

            if (xml) {
                download(xml, 'diagram.bpmn', 'application/xml');

            }
        });
    });

});