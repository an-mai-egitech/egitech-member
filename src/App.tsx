import "./styles.css";
import { useState, useEffect } from "react";
import User from "./UserModel";
import axios from "axios";

const ColumnNameAttribute = {
  id: "id",
  fullname: "fullname",
  email: "email",
  birtDate: "date_of_birth",
  age: "age"
};

export default function App(): JSX.Element {
  const [originalData, setOriginalData] = useState<User[]>([]);
  const [data, setData] = useState<User[]>([]);
  const [sortId, setSortId] = useState<boolean>(true);
  const [sortName, setSortName] = useState<boolean>(true);
  const [sortEmail, setSortEmail] = useState<boolean>(true);
  const [sortBithDate, setSortBithDate] = useState<boolean>(true);
  const [sortAge, setSortAge] = useState<boolean>(true);
  const [query, setQuery] = useState<string>("");

  const getAge = (date_of_birth: string) => {
    return new Date().getFullYear() - new Date(date_of_birth).getFullYear();
  };

  const formatDateOfBirth = (date_of_birth: string): string => {
    return new Date(date_of_birth).toLocaleDateString("en-GB");
  };

  const transformData = (users: User[]) => {
    return users.map((e: User) => ({
      ...e,
      fullname: e.first_name + " " + e.last_name,
      age: getAge(e.date_of_birth)
    }));
  };

  const fetchData = async () => {
    const data = await axios.get(
      "https://random-data-api.com/api/users/random_user?size=10"
    );

    const transfromData = transformData(data.data);

    setOriginalData(transfromData);
    setData(transfromData);
  };

  const searchData = () => {
    if (query === "") {
      setData(originalData);
      return;
    }

    const list = originalData.map((e: User) => ({ ...e }));

    setData(
      list.filter((item) => {
        const value =
          item.id === Number.parseInt(query) ||
          item.fullname.toLowerCase().includes(query.toLowerCase()) ||
          item.email.toLowerCase().includes(query.toLowerCase()) ||
          formatDateOfBirth(item.date_of_birth).includes(query) ||
          item.age === Number.parseInt(query);

        return value;
      })
    );
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    searchData();
  }, [query]);

  const onSortWithColumn = (column: string) => {
    const sortData = originalData.map((e: User) => ({ ...e }));

    let sortType = true;

    switch (column) {
      case ColumnNameAttribute.id:
        sortType = sortId;
        setSortId(!sortType);
        break;
      case ColumnNameAttribute.fullname:
        sortType = sortName;
        setSortName(!sortType);
        break;
      case ColumnNameAttribute.email:
        sortType = sortEmail;
        setSortEmail(!sortType);
        break;
      case ColumnNameAttribute.birtDate:
        sortType = sortBithDate;
        setSortBithDate(!sortType);
        break;
      case ColumnNameAttribute.age:
        sortType = sortAge;
        setSortAge(!sortType);
        break;
    }

    if (!(column === ColumnNameAttribute.birtDate)) {
      if (sortType) {
        setData(
          sortData.sort((first: User, second: User) =>
            first[column as keyof User] > second[column as keyof User] ? 1 : -1
          )
        );
      } else {
        setData(
          sortData.sort((first: User, second: User) =>
            first[column as keyof User] < second[column as keyof User] ? 1 : -1
          )
        );
      }
    } else {
      if (sortBithDate) {
        setData(
          sortData.sort((first: User, second: User) =>
            Date.parse(first.date_of_birth) > Date.parse(second.date_of_birth)
              ? 1
              : -1
          )
        );
      } else {
        setData(
          sortData.sort((first: User, second: User) =>
            Date.parse(first.date_of_birth) < Date.parse(second.date_of_birth)
              ? 1
              : -1
          )
        );
      }
    }
  };

  return (
    <div className="App">
      <h1>Hello Egitech members</h1>
      <h2>Start fill data and sort in 5 mins</h2>
      <p>https://random-data-api.com/api/users/random_user?size=10</p>
      <div style={{ textAlign: "start" }}>
        <ul>
          <li>List user from api</li>
          <li>Format Brithday (dd/MM/yyyy)</li>
          <li>Search all</li>
          <li>Sort column desc or asc</li>
        </ul>
      </div>

      <div>
        Search:
        <input onChange={(e) => setQuery(e.target.value)} />
      </div>

      <table>
        <thead>
          <tr>
            <th>
              #{" "}
              <button onClick={() => onSortWithColumn(ColumnNameAttribute.id)}>
                id
              </button>
            </th>
            <th>
              Full Name{" "}
              <button
                onClick={() => onSortWithColumn(ColumnNameAttribute.fullname)}
              >
                Sort
              </button>
            </th>
            <th>
              email{" "}
              <button
                onClick={() => onSortWithColumn(ColumnNameAttribute.email)}
              >
                email
              </button>
            </th>
            <th>
              Brithday{" "}
              <button
                onClick={() => onSortWithColumn(ColumnNameAttribute.birtDate)}
              >
                Birthday
              </button>
            </th>
            <th>
              Age{" "}
              <button onClick={() => onSortWithColumn(ColumnNameAttribute.age)}>
                Age
              </button>
            </th>
          </tr>
        </thead>
        <tbody>
          {data.map((user: User) => {
            return (
              <tr>
                <td>{user.id}</td>
                <td>{user.fullname}</td>
                <td>{user.email}</td>
                <td>{formatDateOfBirth(user.date_of_birth)}</td>
                <td>{user.age}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
