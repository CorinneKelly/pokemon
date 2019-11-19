import { observable, decorate } from 'mobx';

class ObservablePokemonStore {
  pokemon = {};

  savePokemon = (pokemonData: Object) => {
    //NOTE: captures only the original 151 pokemon
    const pokemonDataCopy = this.pokemon
    const newPokemonData = pokemonDataCopy[pokemonData.name] = pokemonData
    const newPokemonDataCount = Object.keys(newPokemonData).length
    if(newPokemonDataCount >= 151) {
      return;
    }

    this.pokemon[pokemonData.name] = pokemonData
  };
}

const observedOrdersStore = new ObservablePokemonStore();
export default decorate(observedOrdersStore, {pokemon: observable, savePokemon: observable});
