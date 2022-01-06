// SPDX-License-Identifier: MIT

pragma solidity ^0.8.10;
pragma experimental ABIEncoderV2;

contract Mappings {

    uint256 public userCounter = 0;

    struct Persona {
        uint id;
        string name;
        uint age;
        string ocupation;
    }

    mapping(uint => Persona) public personas;

    function setPesona (string memory _name, uint _age, string memory _ocupation) public  {
        userCounter++;
        personas[userCounter] = Persona(userCounter, _name, _age, _ocupation);
    }

    function getPersona (uint _id) public view returns (Persona memory) {
        return personas[_id];
    }

}