import { observable, decorate } from 'mobx';

class ObservablePokemonStore {
  pokemon = {};

  savePokemon = (pokemonData: Object) => {
    this.pokemon[pokemonData.name] = {...pokemonData, img: pokemonData.sprites.front_default}
  };
}

const observedOrdersStore = new ObservablePokemonStore();
export default decorate(observedOrdersStore, {pokemon: observable, savePokemon: observable});
