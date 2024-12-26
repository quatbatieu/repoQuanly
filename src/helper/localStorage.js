if(!process.env.REACT_APP_PROJECT_NAME){
  console.log("No variable REACT_APP_PROJECT_NAME! file .env")
}

const PROJECT_NAME = process.env.REACT_APP_PROJECT_NAME || "";

const addKeyLocalStorage = (key) => {
  return PROJECT_NAME + "_" + key
}

export default addKeyLocalStorage;