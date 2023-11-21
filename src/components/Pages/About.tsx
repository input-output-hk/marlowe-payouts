import React from 'react';

type AboutProps = {
};

export const About: React.FC<AboutProps> = () => {
  return (
      <div style={{fontFamily:"inter"}}>
        
        <h3>Discover, track, and withdraw role tokens</h3>
          <p>The payouts DApp prototype is an example of a decentralized application designed to help users discover, track, and withdraw tokens from Marlowe 
            smart contracts that use role tokens. It enables holders of role tokens in Marlowe smart contracts to withdraw the received funds, 
            simplifying the process of tracking and withdrawing their payouts.</p> 

          <p>Since role tokens can be ada handles, ada domains, or custom tokens, users have a lot of flexibility with how to use the payouts DApp component.</p> 
        <h3>Built with the Marlowe TS-SDK</h3>

          <p>Marlowe developers built the payouts DApp prototype using the <a href="https://github.com/input-output-hk/marlowe-ts-sdk/" target="_blank" rel="noopener noreferrer">
                Marlowe TypeScript SDK (TS-SDK)
               </a>, which provides a powerful way of writing web applications. 
            The TS-SDK is a collection of JavaScript and TypeScript libraries that helps DApp developers interact with the Marlowe ecosystem.</p> 

        <h3>Intended use</h3>

        <p>The payouts DApp prototype illustrates functionality that is available through the Marlowe TS-SDK.</p> 

        DApp developers can think about the payout DApp from multiple points of view :
        <ul>
          <li>as an example of a standalone application</li>
          <li>as functionality that they could incorporate into a DApp</li>
          <li>as a component that they could integrate into a wallet.</li>
        </ul> 
          
        <p>For example, it is possible to integrate the payouts DApp into a wallet so that when you go to the wallet, 
           you see all the available role tokens you can withdraw from Marlowe contracts without using a separate application.</p>

        <h3>Use alongside Marlowe Runner</h3>
        
        <p>Using the payouts DApp functionality alongside <a href="https://marlowe-runner-production.up.railway.app/" target="_blank" rel="noopener noreferrer">Runner</a>, you can connect a wallet 
          authorized to receive funds to the payouts DApp when advancing a contract through <a href="https://marlowe-runner-production.up.railway.app/" target="_blank" rel="noopener noreferrer">Runner</a>. 
          Once the wallet is connected, <a href="https://marlowe-runner-production.up.railway.app/" target="_blank" rel="noopener noreferrer">Runner</a> will display a list of contracts you are part of.</p> 

        <p>The payouts DApp lists available role tokens that an authorized role can withdraw for that wallet. 
          The recipient clicks the ‘Withdraw’ button and sees a prompt to sign the transaction. 
          After the recipient signs the transaction, the transaction is confirmed. The recipient can then see the funds in their wallet.</p> 
          
        <h3>Role tokens</h3>

          <p>At a high level, role tokens are a unique feature of Marlowe smart contracts that provide additional security and flexibility. 
            They are used to authorize transactions, and any participant in a contract can hold them.</p> 

          <p>Each participant in a Marlowe contract has a role, and each role has its own role token. Participants 
            hold role tokens in their wallets and use them to authorize transactions. Participants who want to make a transaction 
            include their role token as input. The token doesn’t stay with the script or go anywhere else; it simply passes through 
            the script and returns to the participant, allowing them to authorize another transaction.</p> 

          <p>Role tokens can be transferred between wallets, which means a participant can give their role to someone else. This 
            feature introduces flexibility and security beyond the use of private keys alone.</p>


        
          
      </div>
  );
};
