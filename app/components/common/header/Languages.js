import React, {Component} from 'react'
import {FormattedMessage} from 'react-intl'
import {DropdownButton, MenuItem} from 'react-bootstrap'

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
      <DropdownButton bsStyle={'info'} title={<FormattedMessage id="Header.change_language" />}>
      {
        languages && languages.length && languages.map(lang =>
          <MenuItem key={lang.id} eventKey={() => doChangeLang(lang.id)}>{lang.name}</MenuItem>
        )
      }
      </DropdownButton>
    )
  }

  toggleMenu(event) {
    event.preventDefault()
    this.setState({isMenuOpen: !this.state.isMenuOpen})
  }
}

export default Languages
