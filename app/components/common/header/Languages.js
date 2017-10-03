import React, {Component} from 'react'
import {FormattedMessage} from 'react-intl'

class Languages extends Component {

  constructor (props) {
    super(props)
    this.toggleMenu = this.toggleMenu.bind(this)
    this.state = {isMenuOpen: false}
  }

  render () {
    const {languages, doChangeLang} = this.props
    const {isMenuOpen} = this.state

    return (
      <span className="dropdown" onClick={this.toggleMenu}>
        <FormattedMessage id="Header.change_language" />
        <ul className="dropdown-menu" style={{display: isMenuOpen ? 'block' : 'none'}}>
        {
          languages && languages.length && languages.map(lang =>
            <li key={lang.id} onClick={() => doChangeLang(lang.id)}>{lang.name}</li>
          )
        }
        </ul>
      </span>
    )
  }

  toggleMenu(event) {
    event.preventDefault()
    this.setState({isMenuOpen: !this.state.isMenuOpen})
  }
}

export default Languages
