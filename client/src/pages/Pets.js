import React, { useState, useEffect } from "react";
import gql from "graphql-tag";
import { useQuery, useMutation } from "@apollo/react-hooks";
import PetsList from "../components/PetsList";
import NewPetModal from "../components/NewPetModal";
import Loader from "../components/Loader";

export default function Pets() {
  const [modal, setModal] = useState(false);

  const PETS_FIELDS = gql`
    fragment petsfields on Pet {
      name
      id
      img
      type
    }
  `;
  const PETS_QUERY = gql`
    query Pets {
      pets { ...petsfields }
    }
    ${PETS_FIELDS}
  `;
  const ADD_PETS_QUERY = gql`
    mutation AddPet($name: String!, $type: PetType!) {
      addPet(input: { name: $name, type: $type }) {
        id
        type
        name
        img
      }
    }
  `;
  const { data, loading, refetch } = useQuery(PETS_QUERY);
  const [
    addPets,
    { loading: loadingAddedPets, data: newPetsData },
  ] = useMutation(ADD_PETS_QUERY, {
    // onCompleted: () => refetch(),
    update: (cache, { data: { addPet } }) => {
      const { pets } = cache.readQuery({ query: PETS_QUERY });
      cache.writeQuery({
        query: PETS_QUERY,
        data: { pets: [addPet].concat(pets) },
      });
    },
  });

  const onSubmit = (input) => {
    setModal(false);
    addPets({
      variables: input,
      optimisticResponse: {
        __typename: "Mutation",
        addPet: {
          __typename: "Pet",
          id: "hbd978e2nj",
          name: input.name,
          type: input.type,
          img: "",
        },
      },
    });
  };

  if (loading) return <Loader />;

  if (modal) {
    return <NewPetModal onSubmit={onSubmit} onCancel={() => setModal(false)} />;
  }

  return (
    <div className="page pets-page">
      <section>
        <div className="row betwee-xs middle-xs">
          <div className="col-xs-10">
            <h1>Pets</h1>
          </div>

          <div className="col-xs-2">
            <button onClick={() => setModal(true)}>new pet</button>
          </div>
        </div>
      </section>
      <section>
        <PetsList pets={data.pets} />
      </section>
    </div>
  );
}
