import React, { Component } from 'react';
import './App.css';
import MainView from './MainView/mainView';
import { BrowserRouter } from 'react-router-dom';
import axios from 'axios';
import Modeler from '../modeler';
import PropertiesPanel from '../properties-panel';
import reducedPaletteModule from '../modeler/features/reduced-palette';
import reducedContextPadModule from '../modeler/features/reduced-context-pad';
import customModdleExtension from '../modeler/moddle/custom.json';
import Administrator from '../containers/Administrator/administrator';
import {
  download
} from '../util';

import diagramXML from '../diagram.bpmn';
//axios.defaults.baseURL = 'http://localhost:3002/';

 
const $admin = document.querySelector('#admin');
const $graph = document.querySelector('#graph');

$admin.addEventListener('click', function() {
    
    const Administrator = React.createClass({
        componentDidMount: function() {
            
          // Every React component has a function that exposes the
          // underlying DOM node that it is wrapping. We can use pass that 
          // DOM node to jQuery and initialize the plugin.
      
          // You'll find that many jQuery plugins follow this same pattern 
          // and you'll be able to pass the component DOM node to jQuery 
          // and call the plugin function.
          $(ReactDOM.findDOMNode(this)).Administrator;
        },
      
        render: function() {
          return <div>
            {this.props.text}
          </div>;
        }
      });
});

  
  $graph.addEventListener('click', function() {

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
    
      $downloadButton.addEventListener('click', function() {
    
        modeler.saveXML({ format: true }, function(err, xml) {
            
          if (xml) {
            download(xml, 'diagram.bpmn', 'application/xml');
            
          }
        });
      });
    
  });
 

        
    

