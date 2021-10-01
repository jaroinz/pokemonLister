/**
 * identifies some pokemon's details
 */
import {Link} from "./link";

export class Pokemon {
  id = '';
  name = '';
  url = '';
  artUrl = '';
  speciesName = '';
  speciesUrl = '';
  evolutionLinks : Link[] = [];
  hideParent = false;
  slideIndex = 1;
  title = '';
}
