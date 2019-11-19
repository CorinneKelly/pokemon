import React from 'react'
import { BrowserRouter as  Link } from 'react-router-dom';
import { observer } from 'mobx-react';
import PokemonStore from '../stores/PokemonStore'


const Home = observer(class Home extends React.Component {
  count;
  state = {
    nextPokemonCall: 'https://pokeapi.co/api/v2/pokemon/',
    query: '',
    matches: []
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
    if(Object.keys(PokemonStore.pokemon) >= 151) {
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

      this.setState({
        nextPokemonCall: responseJSON.next,
      })
    })
  }

  fetchAndSavePokemonData = (pokemonInfo) => {
    //NOTE:saving here so page can load name before image and other info are fetched
    PokemonStore.savePokemon(pokemonInfo)
    fetch(pokemonInfo.url).then(async response => {
      const responseJSON = await response.json()
      PokemonStore.savePokemon(responseJSON)
    })
  }

  capitalize = (name) => {
    return name[0].toUpperCase() + name.slice(1);
  }

  renderPokemonList = () => {
    const pokemons = this.state.query.length > 0 ? this.state.matches : Object.keys(PokemonStore.pokemon)
    return pokemons.map((pokemonName, index) => {
      const pokemonData = PokemonStore.pokemon[pokemonName]
      const pokemonNameFormatted = this.capitalize(pokemonData.name)
      const hasImages = PokemonStore.pokemon[pokemonData.name] && PokemonStore.pokemon[pokemonData.name].sprites && PokemonStore.pokemon[pokemonData.name].sprites.front_default
        return(
          <Link to={`pokemon/${pokemonName}`} key={index}>
            <div className={'listItem'}>
              <img crossOrigin={'Anonymous'} className={'listItemImg'} src={hasImages ? PokemonStore.pokemon[pokemonData.name].sprites.front_default : 'loading_spinner.svg'} alt={pokemonNameFormatted} height={'100px'} width={'100px'}/>
              <div>{pokemonNameFormatted}</div>
            </div>
          </Link>
      )}
    )
  }

  search = () => {
    const el = document.getElementById('search')
    const query = el.value
    if(query.length === 0) {
      this.setState({
        query: '',
        matches: []
      })
      return;
    }

    let matches = []
    Object.keys(PokemonStore.pokemon).map(name => {
      if(name.includes(query)){
        matches.push(name)
      }
      return name;
    })
    this.setState({
      query,
      matches
    })
  }

  render () {
    return (
      <div>
      <input id={'search'} type="text" onKeyDown={this.search} />

        <div className={'listWrapper'}>
          {this.renderPokemonList()}
        </div>
      </div>
  )}
})

export default Home;
