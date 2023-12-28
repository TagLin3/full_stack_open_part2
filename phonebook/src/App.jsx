import { useState, useEffect } from "react";
import axios from "axios";

const PersonForm = ({
  handleFormSubmit,
  newName,
  newNumber,
  setNewName,
  setNewNumber,
}) => (
  <form onSubmit={handleFormSubmit}>
    <div>
      name:{" "}
      <input
        value={newName}
        onChange={(event) => setNewName(event.target.value)}
      />
      <br />
      number:{" "}
      <input
        value={newNumber}
        onChange={(event) => setNewNumber(event.target.value)}
      />
    </div>
    <div>
      <button type="submit">add</button>
    </div>
  </form>
);

const Persons = ({ personsToShow }) => (
  <ul>
    {personsToShow.map((person) => (
      <Person name={person.name} key={person.name} number={person.number} />
    ))}
  </ul>
);

const Person = ({ name, number }) => (
  <li>
    {name} {number}
  </li>
);

const Filter = ({ filter, setFilter }) => (
  <form>
    filter shown with{" "}
    <input value={filter} onChange={(event) => setFilter(event.target.value)} />
  </form>
);

const App = () => {
  const [persons, setPersons] = useState([]);
  const [newName, setNewName] = useState("");
  const [newNumber, setNewNumber] = useState("");
  const [filter, setFilter] = useState("");

  useEffect(() => {
    axios.get("http://localhost:3001/persons").then((response) => {
      setPersons(response.data);
    });
  }, []);

  const handleFormSubmit = (event) => {
    event.preventDefault();
    if (
      persons.some(
        (person) => person.name === newName || person.number === newNumber
      )
    ) {
      window.alert(`${newName} or ${newNumber} is already added to phonebook`);
    } else {
      setPersons(persons.concat({ name: newName, number: newNumber }));
      setNewName("");
      setNewNumber("");
    }
  };

  const personsToShow = persons.filter((person) =>
    person.name.toLowerCase().startsWith(filter.toLowerCase())
  );

  return (
    <div>
      <h2>Phonebook</h2>
      <Filter filter={filter} setFilter={setFilter} />
      <h3>Add a new</h3>
      <PersonForm
        handleFormSubmit={handleFormSubmit}
        newName={newName}
        newNumber={newNumber}
        setnewName={setNewName}
        setNewNumber={setNewNumber}
      />
      <h3>Numbers</h3>
      <Persons personsToShow={personsToShow} />
    </div>
  );
};

export default App;
