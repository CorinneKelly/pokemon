import React from 'react'
import {GoogleApiWrapper, Map, Marker} from 'google-maps-react';

const API_KEY = 'HHko9Fuxf293b3w56zAJ89s3IcO9D5enaEPIg86l'

class Pokemon extends React.Component {
  state = {
    pokemon: null,
    saved: true,
    locations: []
  }

  componentDidMount = async () => {
    this.fetchPokemonData()
  }

  fetchPokemonData = () => {
    const pokemonName = this.props.match.params.name
    fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonName}`).then(async response => {
      const responseJSON = await response.json();
      this.setState({
        pokemon: responseJSON
      })
      this.fetchPokemonLocation(responseJSON.id)
    })
  }

  fetchPokemonLocation = async (pokemonID) => {
    const options = {
      method: 'GET',
      headers: {
        'x-api-key': API_KEY
      },
    }
    fetch(`https://api.craft-demo.net/pokemon/${pokemonID}`, options).then(async response => {
      const responseJSON = await response.json()
      this.setState({
        locations: responseJSON.locations
      })
    })
  }

  renderAbilities = () => {
    const abilities =  this.state.pokemon.abilities.map(abilityData => abilityData.ability.name)
    return <span>{abilities.join(', ')}</span>
  }

  onToggleSave = () => {
    const currentBag = window.localStorage.getItem('myBag')
    const updatedBag = currentBag.includes(this.state.pokemon.name) ? currentBag.filter(name => name !== this.state.pokemon.name) : [...currentBag, this.state.pokemon.name]
    window.localStorage.setItem('myBag', updatedBag)
  }
  render () {
    const renderMap = this.state.locations.length > 0
    const currentBag = window.localStorage.getItem('myBag')
    if (!this.state.pokemon) {
      return null;
    }
    return (
      <div className={'flexRow'} style={{width: '100vw', margin: 20}}>
        <div style={{width: '25vw', padding: 20}}>
          <img crossOrigin={'Anonymous'} className={'listItemImg'} src={this.state.pokemon.sprites.front_default} alt={this.state.pokemon.name}/>
          <div>{this.state.pokemon.name}</div>
          <div>Height: {this.state.pokemon.height}</div>
          <div>Weight: {this.state.pokemon.weight}</div>
          <div>In Bag:
            <input type="checkbox" name="saved"
               value={this.state.saved}
               checked={currentBag.includes(this.state.pokemon.name)}
               onChange={this.onToggleSave} />

          </div>
          <div>
            Abilities: {this.renderAbilities()}
          </div>
      </div>
      <div style={{width: '75vw'}}>
        {renderMap && <Map
          google={this.props.google}
          initialCenter={{
            lat:this.state.locations[0].split(',')[0],
            lng:this.state.locations[0].split(',')[1]
          }}
          zoom={8}
          style={{height: '500px', width: '500px'}}>
            {this.state.locations.map(location => <Marker position={{lat: location.split(',')[0], lng: location.split(',')[1]}} />)}
          </Map>}

        </div>
      </div>
    )
  }
}


export default GoogleApiWrapper({
  apiKey: ('AIzaSyCN8YHUZl7L4bY6MGm1ofUhQBIoyWjQiLc')
})(Pokemon)
