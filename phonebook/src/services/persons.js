import axios from "axios";

const url = "http://localhost:3001/persons";

const getAll = () => {
  const request = axios.get(url);
  return request.then((r) => r.data);
};

const create = (person) => {
  const request = axios.post(url, person);
  return request.then((r) => r.data);
};

const deletePerson = (id) => {
  return axios.delete(`${url}/${id}`);
};

const update = (id, newPerson) => {
  const request = axios.put(`${url}/${id}`, newPerson);
  return request.then((r) => r.data);
};

export default { create, getAll, deletePerson, update };
