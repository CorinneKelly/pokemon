import React from 'react'
import { BrowserRouter as  Link } from 'react-router-dom';
import { observer } from 'mobx-react';
import PokemonStore from '../stores/PokemonStore'


const Home = observer(class Home extends React.Component {
  count;
  state = {
    nextPokemonCall: 'https://pokeapi.co/api/v2/pokemon/',
    count: 0,
    pokemons: []
  }

  componentDidMount = () => {
    window.addEventListener('scroll', this.handleScroll, true);
    this.fetchPokemon();
  }

  componentWillUnmount() {
    window.removeEventListener('scroll', this.handleScroll);
  }

  handleScroll = () => {
    if (
      window.innerHeight + document.documentElement.scrollTop
      === document.documentElement.offsetHeight
    ) {
      this.fetchPokemon();
    }
  }

  fetchPokemon = async () => {
    if(this.state.pokemons.length >= 151) {
      return;
    }
    fetch(this.state.nextPokemonCall).then(async response => {

      const responseJSON = await response.json()
      if(!this.count) {
        this.count = responseJSON.count
      }

      responseJSON.results.map(pokemon =>
        this.fetchAndSavePokemonData(pokemon)
      )

      const pokemons = this.state.pokemons.length + 20 >= 151 ? this.state.pokemons.concat(responseJSON.results).slice(0, 151) :  [...this.state.pokemons, ...responseJSON.results]

      console.log({pokemons})
      this.setState({
        pokemons,
        nextPokemonCall: responseJSON.next,
      })
    })
  }

  fetchAndSavePokemonData = (pokemonInfo) => {
      fetch(pokemonInfo.url).then(async response => {
        const responseJSON = await response.json()
        PokemonStore.savePokemon(responseJSON)
      })
  }

  capitalize = (name) => {
    return name[0].toUpperCase() + name.slice(1);
  }

  renderPokemonList = () => {
    return this.state.pokemons.map(pokemon =>
      {
        const pokemonName = this.capitalize(pokemon.name)
        return(
          <Link to={`pokemon/${pokemon.name}`} >
          <div  className={'listItem'}>
            <img crossOrigin={'Anonymous'} className={'listItemImg'} src={PokemonStore.pokemon[pokemon.name] ? PokemonStore.pokemon[pokemon.name].img : ''} alt={pokemonName}/>
            <div>{pokemonName}</div>
            </div>
          </Link>
      )}
    )
  }

  render () {
    return (
      <div className={'listWrapper'}>
        {this.renderPokemonList()}
      </div>
  )}
})

export default Home;
