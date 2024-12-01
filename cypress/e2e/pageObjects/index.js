import { loginpage } from "../pageObjects/loginpage"
import { homepage } from "../pageObjects/homepage"

const pages = {
      loginpage,
      homepage,
    };  

export function getXpath(page_name,locator_name){
  var locator = locator_name.replaceAll(' ', '_').toLowerCase();
  var page = page_name .replace(/\s+/g, '').toLowerCase();

  if (pages[page]){
    if(pages[page][locator]){
      return (pages[page][locator])
    } else{
      throw new Error(`${locator} is not available in ${page}`)
    }
  } else{
    throw new Error(`${page} is not exist`)
  }
}