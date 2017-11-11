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
      <span data-test-id="Languages.showLangId" className={lang.get(langId) === current ? 'selected': ''}>
        {lang.get(langId)}
      </span>
    )

    const title = (
      <span data-test-id="Languages.title">
      {
        languages.map((item, index) =>
          <span data-test-id="Languages.langItem" key={item.id}>
            {showLangId(item.id)}{index < languages.length - 1 ? '/': ''}
          </span>
        )
      }
      </span>
    )

    return (
      <div data-test-id="Languages" className="languages-bar-header">
        <DropdownButton data-test-id="Languages.Dropdown" title={title} pullRight id={`languagesDropdown`}>
        {
          languages.map(item =>
            <MenuItem data-test-id="Languages.MenuItem" key={item.id} onSelect={() => doChangeLang(item.id)}>
              {showLangId(item.id)} - {item.name}
            </MenuItem>
          )
        }
        </DropdownButton>
      </div>
    )
  }

  toggleMenu(event) {
    event.preventDefault()
    this.setState({isMenuOpen: !this.state.isMenuOpen})
  }
}

export default Languages
