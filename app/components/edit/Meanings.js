import React, {Component} from 'react'
import {connect} from 'react-redux'

import {selectTranslation} from '../../actions'

class Meanings extends Component {
  constructor (props) {
    super(props)
    this.onVersionChanged = this.onVersionChanged.bind(this)
  }

  render () {
    return (
      <div>
        <h2>{this.props.data.termName}</h2>
        <ul className="meaningList">
        {
          this.props.data.source.meanings.map((meaning, meaningIndex) =>
          <li key={meaningIndex}>
            <div className="title">Значение {meaningIndex + 1}</div>
            <ul className="versionList">
            {
              meaning.versions.map((version, versionIndex) =>
                <li key={versionIndex} className="form-group form-inline">
                  <input className="form-control"
                    name="search" type="text"
                    value={version}
                    onChange={this.onVersionChanged}/>
                    <button type="button" className="btn btn-link btn-sm remove-btn">X</button>
                </li>
              )
            }
              <li className="form-group form-inline">
                <input className="form-control"
                  name="search" type="text"
                  onChange={this.onVersionChanged}/>
              </li>
            </ul>
            <div className="_col-md-8">
              <span> Комментарий: </span>
              <span> {meaning.comment} </span>
              <span>[X]</span>
            </div>
          </li>
          )
        }
        <li>
          [новое значение]
        </li>
        </ul>
      </div>
    )
  }

  onVersionChanged (event) {
    console.log(event.target.value)
    //this.props.dispatch(changeVersion(event.target.value))
  }
}

function select (state) {
  return {
    data: state.edit
  }
}

export default connect(select)(Meanings)
