import { useState, useEffect } from "react";
import personService from "./services/persons";

const Notification = ({ message, error }) => {
  if (message === null) {
    return null;
  }

  const style = {
    marginBottom: 10,
    borderRadius: 5,
    padding: 10,
    fontSize: 20,
    borderStyle: "solid",
    background: "lightgray",
    color: "green",
  };

  if (error) {
    style.color = "red";
  }

  return <div style={style}>{message}</div>;
};

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

const Persons = ({ personsToShow, deletePerson }) => (
  <ul>
    {personsToShow.map((person) => (
      <Person
        name={person.name}
        number={person.number}
        id={person.id}
        key={person.name}
        deletePerson={deletePerson}
      />
    ))}
  </ul>
);

const Person = ({ name, number, id, deletePerson }) => (
  <li>
    {name} {number}
    <button onClick={() => deletePerson(id, name)}>delete</button>
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
  const [message, setMessage] = useState(null);
  const [isErrorMessage, setIsErrorMessage] = useState(false);

  useEffect(() => {
    personService.getAll().then((returnedPersons) => {
      setPersons(returnedPersons);
    });
  }, []);

  const handleFormSubmit = (event) => {
    event.preventDefault();
    const personObj = {
      name: newName,
      number: newNumber,
    };
    if (persons.some((person) => person.number === newNumber)) {
      window.alert(`The number ${newNumber} is already added to phonebook`);
    } else if (persons.some((person) => person.name === newName)) {
      if (
        window.confirm(
          `${newName} is already added to the phonebook, replace the old number with a new one?`
        )
      ) {
        const personToUpdate = persons.find(
          (person) => person.name === newName
        );
        personService
          .update(personToUpdate.id, personObj)
          .then((updatedPerson) => {
            setPersons(
              persons.map((p) =>
                p.id !== personToUpdate.id ? p : updatedPerson
              )
            );
            setIsErrorMessage(false);
            setMessage(`Updated phone number of ${personObj.name}`);
            setTimeout(() => {
              setMessage(null);
            }, 3000);
          })
          .catch((error) => {
            setIsErrorMessage(true);
            setMessage(
              `information of ${personObj.name} has already been removed from server`
            );
            setPersons(persons.filter((p) => p.name !== personObj.name));
            setNewName("");
            setNewNumber("");
            setTimeout(() => {
              setMessage(null);
            }, 3000);
          });
      }
    } else {
      personService.create(personObj).then((createdPerson) => {
        setPersons(persons.concat(createdPerson));
        setNewName("");
        setNewNumber("");
        setIsErrorMessage(false);
        setMessage(`Added ${personObj.name}`);
        setTimeout(() => {
          setMessage(null);
        }, 3000);
      });
    }
  };
  const personsToShow = persons.filter((person) =>
    person.name.toLowerCase().startsWith(filter.toLowerCase())
  );

  const deletePerson = (id, name) => {
    if (window.confirm(`Delete ${name} ?`)) {
      personService.deletePerson(id).then(() => {
        setPersons(persons.filter((p) => p.id !== id));
      });
    }
  };

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification message={message} error={isErrorMessage} />
      <Filter filter={filter} setFilter={setFilter} />
      <h3>Add a new</h3>
      <PersonForm
        handleFormSubmit={handleFormSubmit}
        newName={newName}
        newNumber={newNumber}
        setNewName={setNewName}
        setNewNumber={setNewNumber}
      />
      <h3>Numbers</h3>
      <Persons personsToShow={personsToShow} deletePerson={deletePerson} />
    </div>
  );
};

export default App;
