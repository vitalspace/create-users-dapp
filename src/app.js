'use strict';

import Web3 from "web3";

document.querySelector('#root').innerHTML = `
  <h1>Hello <span id="metamask_id"></span></h1>    
  <h2>Set a User</h2>
  <div style="width: max-content; padding: 10px; border-radius: 5px; box-shadow: 1px 1px 5px #7a7a7a;">
    <input type="text" name="id" id="name" placeholder="Set Name" style="margin: 10px;" />
    <br/>
    <input type="number" name="id" id="age" placeholder="Set Age" style="margin: 10px; "/>
    <br/>
    <input type="text" name="id" id="ocupation" placeholder="Set Ocupatiom" style="margin: 10px; "/>
    <br/>
    <button id="submit" style="margin: 10px;">Submit</button>
  </div>
  <h2>Current Users</h2>
  <div id="users" style="display: flex; justify-content: space-around; flex-wrap: wrap;"> </div>
`;

const App = {

  network_id: 5777,
  contract_path: 'src/contract.json',
  contract_address: '0x182a3dCC404cB3CAe14B774f8c3be236632Eb682',

  init: async () => {
    await App.loadWeb3();
    await App.loadAccount();
    await App.loadContract();
  },

  loadWeb3: async () => {
    if (window.ethereum) {
      web3 = new Web3(window.web3.currentProvider);
      await window.ethereum.request({ method: "eth_requestAccounts" });
    } else {
      console.log('please install metamask')
    }
  },

  loadAccount: async () => {
    const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
    App.account = accounts[0];
    document.querySelector('#metamask_id').innerHTML = App.account;
  },

  loadContract: async () => {
    const netId = await web3.eth.net.getId();
    if (App.network_id === netId) {
      const contract = await App.getContract(web3, App.contract_path, App.contract_address);
      await App.setPerson(contract);
      await App.renderPersons(contract);
    }
  },

  getContract: async (web3, contract_path, contract_address) => {
    const response = await fetch(contract_path);
    const data = await response.json();
    const contract = new web3.eth.Contract(
      data,
      contract_address
    );
    return contract
  },

  setPerson: async (contract) => {
    const btn = document.querySelector('#submit');
    btn.addEventListener('click', async e => {
      if (e) {
        const name = document.querySelector('#name').value;
        const age = document.querySelector('#age').value;
        const ocupation = document.querySelector('#ocupation').value;

        if (name !== "" && age !== "" && ocupation !== "") {
          await contract.methods.setPesona(name, age, ocupation)
            // console.log(methods)
            .send({ from: App.account, gas: 0 })
            .on('transactionHash', function (hash) {
              console.log('Approving', hash)
              // document.getElementById("web3_message").textContent = "Approving...";
            })
            .on('receipt', function (receipt) {
              console.log('Success', receipt)
              // document.getElementById("web3_message").textContent = "Success!";
            })
            .catch((revertReason) => {
              console.log(revertReason)
              // console.log("ERROR! Transaction reverted: " + revertReason.receipt.transactionHash)
            });

        } else {
          alert('All data must be complete');
        }

      }
    })
  },

  renderPersons: async (contract) => {

    const usersCounter = await contract.methods.userCounter().call();

    let html = ``

    for (let i = 1; i <= usersCounter; i++) {

      const result = await contract.methods.getPersona(i).call();

      let card = `
        <div style="box-shadow: 1px 1px 5px #7a7a7a; border-radius: 5px; width: max-content; padding: 20px; text-align: center;"> 
          <div>
            <h2> ${result.name}<h2>
          </div>
          <div>
            <p> ${result.age}<p>
          </div>
          <div>
           <p> ${result.ocupation}<p>
          </div>
        </div>
      `
      html += card;

    }

    document.querySelector("#users").innerHTML = html;

  }

}

App.init();