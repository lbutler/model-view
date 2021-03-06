import React, { Component } from 'react';
import ModelDropZone from '../ModelDropZone';
import VectorMap from '../VectorMap';
import Landing from '../Landing';
import ModelInfo, { ModelInfoSetting } from '../ModelInfo';
import ModelFeatureCollection from '../../interfaces/ModelFeatureCollection';
import './index.css';
import 'mapbox-gl/dist/mapbox-gl.css';
import { FeatureCollection, Geometries, Properties, Feature } from '@turf/helpers';

// TODO: Clean up and remove the requirement for settings and check for null
const setting: ModelInfoSetting = {
  "modeName": "Test Model",
  "currentTimestep": 0,
  "timesteps": ["2018-01-31T00:00:00", "2018-01-31T00:15:00", "2018-01-31T00:30:00", "2018-01-31T00:45:00", "2018-01-31T01:00:00", "2018-01-31T01:15:00", "2018-01-31T01:30:00", "2018-01-31T01:38:00", "2018-01-31T01:45:00", "2018-01-31T02:00:00", "2018-01-31T02:15:00", "2018-01-31T02:30:00", "2018-01-31T02:45:00", "2018-01-31T03:00:00", "2018-01-31T03:15:00", "2018-01-31T03:30:00", "2018-01-31T03:45:00", "2018-01-31T04:00:00", "2018-01-31T04:15:00", "2018-01-31T04:30:00", "2018-01-31T04:45:00", "2018-01-31T05:00:00", "2018-01-31T05:15:00", "2018-01-31T05:30:00", "2018-01-31T05:45:00", "2018-01-31T06:00:00", "2018-01-31T06:15:00", "2018-01-31T06:30:00", "2018-01-31T06:45:00", "2018-01-31T06:57:00", "2018-01-31T07:00:00", "2018-01-31T07:15:00", "2018-01-31T07:30:00", "2018-01-31T07:45:00", "2018-01-31T07:58:00", "2018-01-31T08:00:00", "2018-01-31T08:09:00", "2018-01-31T08:14:00", "2018-01-31T08:15:00", "2018-01-31T08:17:00", "2018-01-31T08:18:00", "2018-01-31T08:19:00", "2018-01-31T08:30:00", "2018-01-31T08:45:00", "2018-01-31T09:00:00", "2018-01-31T09:15:00", "2018-01-31T09:30:00", "2018-01-31T09:45:00", "2018-01-31T10:00:00", "2018-01-31T10:15:00", "2018-01-31T10:30:00", "2018-01-31T10:45:00", "2018-01-31T11:00:00", "2018-01-31T11:15:00", "2018-01-31T11:30:00", "2018-01-31T11:45:00", "2018-01-31T12:00:00", "2018-01-31T12:15:00", "2018-01-31T12:30:00", "2018-01-31T12:45:00", "2018-01-31T13:00:00", "2018-01-31T13:15:00", "2018-01-31T13:30:00", "2018-01-31T13:45:00", "2018-01-31T14:00:00", "2018-01-31T14:15:00", "2018-01-31T14:30:00", "2018-01-31T14:45:00", "2018-01-31T15:00:00", "2018-01-31T15:15:00", "2018-01-31T15:30:00", "2018-01-31T15:45:00", "2018-01-31T16:00:00", "2018-01-31T16:15:00", "2018-01-31T16:30:00", "2018-01-31T16:45:00", "2018-01-31T17:00:00", "2018-01-31T17:15:00", "2018-01-31T17:30:00", "2018-01-31T17:45:00", "2018-01-31T18:00:00", "2018-01-31T18:15:00", "2018-01-31T18:30:00", "2018-01-31T18:45:00", "2018-01-31T19:00:00", "2018-01-31T19:15:00", "2018-01-31T19:30:00", "2018-01-31T19:45:00", "2018-01-31T20:00:00", "2018-01-31T20:15:00", "2018-01-31T20:30:00", "2018-01-31T20:45:00", "2018-01-31T21:00:00", "2018-01-31T21:15:00", "2018-01-31T21:30:00", "2018-01-31T21:45:00", "2018-01-31T22:00:00", "2018-01-31T22:15:00", "2018-01-31T22:30:00", "2018-01-31T22:45:00", "2018-01-31T23:00:00", "2018-01-31T23:15:00", "2018-01-31T23:30:00", "2018-01-31T23:45:00"].map(t => new Date(t)),
  "selectedFeature": null
}

type Props = {}


interface AppState {
  modelGeoJson?: FeatureCollection<Geometries, Properties>
  isLoading: boolean,
  isFileLoaded: boolean,
  projectionString: string,
  setting: ModelInfoSetting
}


class App extends Component<Props, AppState> {
  state: Readonly<AppState> = {
    isLoading: false,
    isFileLoaded: false,
    projectionString: '',
    setting
  };

  loadDemo = () => {
    const projectionString = "+proj=utm +zone=55 +south +ellps=aust_SA +towgs84=-117.808,-51.536,137.784,0.303,0.446,0.234,-0.29 +units=m +no_defs"
    this.setState(prevState => ({ projectionString, isLoading: true }))
    const demo = fetch('https://raw.githubusercontent.com/modelcreate/model-view/master/data/MagneticIsland.json')
      .then(res => res.json())
      .then(body => {
        this.droppedJson(body);
      })
  }

  droppedJson = (file: ModelFeatureCollection) => {

    this.setState(prevState => ({
      isFileLoaded: true,
      modelGeoJson: file,
      setting: {
        ...prevState.setting,
        timesteps: file.model.timesteps.map(t => new Date(t.substr(0, 16)))
      }
    }));
  }
  _updateSettings = (value: string) => {
    this.setState(prevState => ({
      setting: {
        ...prevState.setting,
        currentTimestep: parseInt(value)
      }
    }))

  };

  _updateSelectedFeature = (value: Feature) => {

    if (value.properties !== null) {
      const selectedFeature: { [name: string]: any; } = value.properties
      this.setState(prevState => ({
        setting: {
          ...prevState.setting,
          selectedFeature
        }
      }))
    }

  };

  _clearSelectedFeature = () => {
    this.setState(prevState => ({
      setting: {
        ...prevState.setting,
        selectedFeature: null
      }
    }))
  }

  _updateProjectionString = (projectionString: string) => {
    this.setState(prevState => ({ projectionString, isLoading: true }))
  }


  render() {
    const { isLoading, isFileLoaded, modelGeoJson, setting, projectionString } = this.state

    return (
      <ModelDropZone onDroppedJson={this.droppedJson}>
        <div className="App">
          <header className="App-header">

            {modelGeoJson && projectionString !== '' ?
              <>
                <VectorMap projectionString={projectionString} onSelectFeature={this._updateSelectedFeature} modelGeoJson={modelGeoJson} />
                <ModelInfo settings={setting} onChange={this._updateSettings} onClearSelected={this._clearSelectedFeature} />


              </> :
              <Landing onLoadDemo={this.loadDemo} isLoading={isLoading} isFileLoaded={isFileLoaded} onSelectProj={this._updateProjectionString} />
            }
          </header>

        </div>
      </ModelDropZone>
    );
  }
}

export default App;
