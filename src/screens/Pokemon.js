import React from 'react'
import PropTypes from 'prop-types'

class Pokemon extends React.Component {
  state = {
    pokemon: {
      name: '',
      height: '',
      weight: '',
      abilities: []
    },
    saved: true
  }
  componentDidMount = async () => {
    const pokemonName = this.props.match.params.name
    fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonName}`).then(async response => {
      const responseJSON = await response.json();
      console.log({responseJSON})
      this.setState({
        pokemon: responseJSON
      })
    })
  }

  renderAbilities = () => {
    const abilities =  this.state.pokemon.abilities.map(abilityData => abilityData.ability.name)
    return <span>{abilities.join(', ')}</span>
  }

  onToggleSave = () => {
    this.setState({
      saved: !this.state.saved
    })
  }
  render () {
    console.log({props: this.props})
    return (
      <div>
        <img crossOrigin={'Anonymous'} className={'listItemImg'} src={'https://picsum.photos/200'} alt={this.state.pokemon.name}/>
        <div>{this.state.pokemon.name}</div>
        <div>Height: {this.state.pokemon.height}</div>
        <div>Weight: {this.state.pokemon.weight}</div>
        <div>In Bag: <input type="checkbox" name="saved"
                                   value={this.state.saved}
                                   checked={this.state.saved}
                                   onChange={this.onToggleSave} />

        </div>
        <div>
          Abilities: {this.renderAbilities()}
        </div>
      </div>
    )
  }
}

export default Pokemon;
