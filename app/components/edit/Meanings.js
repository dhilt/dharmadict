import React, {Component} from 'react'
import {connect} from 'react-redux'

import {selectTranslation, onVersionChanged, onVersionRemoved} from '../../actions/edit'

class Meanings extends Component {
  constructor (props) {
    super(props)
    this._onVersionChanged = this._onVersionChanged.bind(this)
    this._onVersionRemoved = this._onVersionRemoved.bind(this)
  }

  render () {
    return (
      <div>
        <h2>{this.props.data.termName}</h2>
        <ul className="meaningList">
        {
          this.props.data.change.meanings.map((meaning, meaningIndex) =>
          <li key={meaningIndex}>
            <div className="title">Значение {meaningIndex + 1}</div>
            <ul className="versionList">
            {
              meaning.versions.map((version, versionIndex) =>
                <li key={versionIndex} className="form-group form-inline">
                  <input className="form-control" name="search" type="text"
                    value={version}
                    onChange={(event) => this._onVersionChanged(event, meaningIndex, versionIndex)}/>
                    <button className="btn btn-link btn-sm remove-btn" type="button"
                      disabled={versionIndex === meaning.versions.length - 1 ? "disabled" : ""}
                      onClick={() => this._onVersionRemoved(meaningIndex, versionIndex)}>X
                    </button>
                </li>
              )
            }
            </ul>
            <div>
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

  _onVersionChanged (event, meaningIndex, versionIndex) {
    this.props.dispatch(onVersionChanged(meaningIndex, versionIndex, event.target.value))
  }

  _onVersionRemoved (meaningIndex, versionIndex) {
    this.props.dispatch(onVersionRemoved(meaningIndex, versionIndex))
  }
}

function select (state) {
  return {
    data: state.edit
  }
}

export default connect(select)(Meanings)
