import React from 'react'

class Home extends React.Component {
  count;
  state = {
    nextPokemonCall: 'https://pokeapi.co/api/v2/pokemon/',
    count: 0,
    pokemon: []
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
    fetch(this.state.nextPokemonCall).then(async response => {

      const responseJSON = await response.json()
      if(!this.count) {
        this.count = responseJSON.count
      }
      this.setState({
        pokemon: [...this.state.pokemon, ...responseJSON.results],
        nextPokemonCall: responseJSON.next,
      })
    })
  }

  capitalize = (name) => {
    return name[0].toUpperCase() + name.slice(1);
  }

  renderPokemonList = () => {
    return this.state.pokemon.map(pokemon =>
      {
        const pokemonName = this.capitalize(pokemon.name)
        return(
          <div className={'listItem'}>
            <img className={'listItemImg'} src={'https://via.placeholder.com/200'} alt={pokemonName}/>
            <div>{pokemonName}</div>
          </div>
      )}
    )
  }


  render () {
    return (
      <div className={'listWrapper'}>
        {this.renderPokemonList()}
      </div>
  )}
}

export default Home;
