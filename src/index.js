import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import reportWebVitals from './reportWebVitals';
import DropdownButton from 'react-bootstrap/DropdownButton';
import Dropdown from 'react-bootstrap/Dropdown';

function Fruit(props) {
    const key= props.key
    const name= props.name
    const family= props.family
    const genus= props.genus
    const order= props.order
    const nutritions_calories= props.nutritions_calories
    const nutritions_carbs= props.nutritions_carbs
    const nutritions_fats= props.nutritions_fats
    const nutritions_protein= props.nutritions_protein
    const nutritions_sugar= props.nutritions_sugar

  return (
    <><ul>
      <li><b>Fruit Name:</b> {name}</li>
      <ul>
        <li><b>Family:</b> {family}</li>
        <li><b>Genus:</b> {genus}</li>
        <li><b>Order:</b> {order}</li>
        <li><b>Nutritional Values</b> (per 100 grams):
          <ul>
            <li><b>Calories:</b> {nutritions_calories + " calories"}</li>
            <li><b>Carbohydrates:</b> {nutritions_carbs + " grams"}</li>
            <li><b>Fat:</b> {nutritions_fats + " grams"}</li>
            <li><b>Protein:</b>  {nutritions_protein + " grams"}</li>
            <li><b>Sugar:</b> {nutritions_sugar + " grams"}</li>
          </ul>
        </li>
    </ul>
  </ul><br></br></>)
}




class Results extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      input: "",
      found: 0,
      fruits: []
    };
  }

  async getInfo(user_input) {
    var url = '/api/fruit/' + user_input;
    try{
      let response = await fetch(url, {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      });
      let data = await response.json();
      console.log(data);      

      this.setState({
        input: user_input,
        fruits: []
      })
      
      console.log("input ", this.state.input);

      if (data["family"]) {
        var this_fruit = <Fruit 
                          key={1}
                          name={data["name"]}
                          family={data["family"]}
                          genus={data["genus"]}
                          order={data["order"]}
                          nutritions_calories={data["nutritions"]["calories"]}
                          nutritions_carbs={data["nutritions"]["carbohydrates"]}
                          nutritions_fats={data["nutritions"]["fat"]}
                          nutritions_protein={data["nutritions"]["protein"]}
                          nutritions_sugar={data["nutritions"]["sugar"]}
                          />
        this.state.fruits.push(this_fruit);
        this.setState({ found: 1 });
      } else if (data[0]){
        for(var i = 0; i < data.length; i ++){
          var this_fruit = <Fruit
            key={i}
            name={data[i]["name"]}
            family={data[i]["family"]}
            genus={data[i]["genus"]}
            order={data[i]["order"]}
            nutritions_calories={data[i]["nutritions"]["calories"]}
            nutritions_carbs={data[i]["nutritions"]["carbohydrates"]}
            nutritions_fats={data[i]["nutritions"]["fat"]}
            nutritions_protein={data[i]["nutritions"]["protein"]}
            nutritions_sugar={data[i]["nutritions"]["sugar"]}
          />
          this.state.fruits.push(this_fruit);
        }
        this.setState({ found: data.length});
      } else {
        // fruit.setState({
        //   found: 0,
        //   name: null,
        //   nutritions_calories: null,
        //   nutritions_carbs: null,
        //   nutritions_fats: null,
        //   nutritions_protein: null,
        //   nutritions_sugar: null
        // });
        this.setState({found: 0, fruits:[]});
      }
    } catch (error) {
      this.setState({ found: 0, fruits: [] });
      console.log("error")
    }
    console.log("fruits ", this.state.fruits);
  }


  handleSubmit = (event) => {
    event.preventDefault()
    // Simple GET request using fetch
    this.getInfo(event.target[0].value);
  }

  render() {
    console.log("render");
    var display_results;
    var results_status;
    if (this.state.input !== "") {
      results_status = (<p>{this.state.found} results found for {this.state.input}:</p>);
      if (this.state.found) {
        display_results = this.state.fruits.map((fruit) => <li>{fruit}</li>);
      } else{
        display_results = null;
      }
    }


    return (
      <>
        <form onSubmit={this.handleSubmit}>
          <label>
            Fruit: 
            <input
              type="text"
              name="fruit"
              defaultValue="all" 
              ref={node => (this.inputNode = node)}
            />
          </label>
          <button type="submit">Submit</button>
        </form>
        <DropdownButton id="dropdown-basic-button" title="Dropdown button">
          <Dropdown.Item href="#/action-1">Action</Dropdown.Item>
          <Dropdown.Item href="#/action-2">Another action</Dropdown.Item>
          <Dropdown.Item href="#/action-3">Something else</Dropdown.Item>
        </DropdownButton>
        {results_status}
        <ul>
          {display_results}
        </ul>
      </>
    )
  }
}

ReactDOM.render(
  <React.StrictMode>
    <Results />
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
