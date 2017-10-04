import React, {Component} from 'react'
import {FormattedMessage} from 'react-intl'
import {DropdownButton, MenuItem} from 'react-bootstrap'
import lang from '../../../helpers/lang'

class Languages extends Component {

  constructor (props) {
    super(props)
    this.toggleMenu = this.toggleMenu.bind(this)
    this.state = {isMenuOpen: false}
  }

  render () {
    const {languages, current, doChangeLang} = this.props
    const {isMenuOpen} = this.state

    if(!languages || !languages.length) {
      return (null)
    }

    const showLangId = (langId) => (
      <span className={lang.get(langId) === current ? 'selected': ''}>
        {lang.get(langId)}
      </span>
    )

    const title = (
      <span>
      {
        languages.map((item, index) =>
          <span key={item.id}>
            {showLangId(item.id)}{index < languages.length - 1 ? '/': ''}
          </span>
        )
      }
      </span>
    )

    return (
      <DropdownButton title={title} id={`languagesDropdown`}>
      {
        languages.map((item, index) =>
          <MenuItem key={item.id} onSelect={() => doChangeLang(item.id)}>
            {showLangId(item.id)} - {item.name}
          </MenuItem>
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
