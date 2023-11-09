# Marlowe Payouts

<img align="right" src="public/images/marlowe-logo-primary.svg" >

Marlowe Payouts is a decentralized application (dApp) designed to help users discover payouts available for withdrawal from Marlowe contracts on the Cardano blockchain. With a user-friendly interface and seamless integration with the Cardano network, Marlowe Payouts simplifies the process of tracking and withdrawing your payouts.

This dApp was built using the [Marlowe-ts-sdk](https://github.com/input-output-hk/marlowe-ts-sdk), a collection of JavaScript/TypeScript libraries that helps dApp developers to interact with the Marlowe ecosystem.

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Features

- **Discover Payouts:** Easily find payouts available for withdrawal from Marlowe Contracts.
- **User-Friendly Interface:** A clean and intuitive design ensures a smooth user experience.
- **Secure:** Built with the security and reliability of the Cardano blockchain in mind.

## Getting Started

To get the dApp up and running on your local machine, follow these steps:

1. **Clone the Repository**
   ```bash
   git clone https://github.com/input-output-hk/marlowe-payouts
   cd marlowe-payouts

2. **Install Dependencies**
   ```bash
   npm install

4. **Configure Marlowe URLs in .env**

   To ensure the dApp communicates correctly with the Marlowe runtime and scan instances, you need to set the appropriate URLs in the `.env` file.

   ### Steps:

   1. **Open the .env File**:
      Navigate to the root directory of your project and open the `.env` file in your preferred text editor.

   2. **Set the Marlowe Runtime Web URL**:
      Locate the line `MARLOWE_RUNTIME_WEB_URL=<Your-Runtime-Instance>`. Replace `<Your-Runtime-Instance>` with the actual URL of your Marlowe runtime instance.

      MARLOWE_RUNTIME_WEB_URL=https://example-runtime-url.com

   3. **Set the Marlowe Scan URL**:
      Locate the line `MARLOWE_SCAN_URL=<Your-Scan-Instance>`. Replace `<Your-Scan-Instance>` with the actual URL of your Marlowe scan instance.

      MARLOWE_SCAN_URL=https://example-scan-url.com

3. **Run the dApp**
   ```bash
   npm run start

## Development with Nix

This repository uses nix to provide the development and build environment.

For instructions on how to install and configure nix (including how to enable access to our binary caches), refer to [this document](https://github.com/input-output-hk/iogx/blob/main/doc/nix-setup-guide.md). 

If you already have nix installed and configured, you may enter the development shell by running `nix develop`.

## Generating Payouts for Testing

To generate payouts for testing purposes on the preprod and preview networks, we recommend using the **Marlowe Starter Kit**. The starter kit provides comprehensive instructions and tools, including Jupyter notebooks, to help you understand and work with Marlowe contracts.

### Steps:

1. **Clone the Marlowe Starter Kit Repository**:
   ```bash
   git clone https://github.com/input-output-hk/marlowe-starter-kit.git
   cd marlowe-starter-kit

2. **Follow the Instructions**:
   Navigate to the [Marlowe Starter Kit repository](https://github.com/input-output-hk/marlowe-starter-kit) and follow the provided instructions to set up and run the Jupyter notebooks.

3. **Generate Payouts**:
   To generate payouts specifically, refer to [Lesson 8 - CIP45](https://github.com/input-output-hk/marlowe-starter-kit/tree/main/lessons/08-cip45) in the starter kit. This lesson provides a detailed guide on how to generate payouts for Marlowe contracts.

By following the above steps, you can easily generate payouts for testing purposes and further explore the capabilities of Marlowe contracts on the Cardano blockchain.

## Additional Resources

- [Marlowe Documentation](https://docs.marlowe.iohk.io/docs/introduction)
- [Marlowe-ts-sdk](https://github.com/input-output-hk/marlowe-ts-sdk)
- [Marlowe Starter Kit](https://github.com/input-output-hk/marlowe-starter-kit)
- [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started)
- [React documentation](https://reactjs.org/)

## Contributing

We welcome contributions from the community! If you'd like to contribute, please fork the repository, make your changes, and submit a pull request. Ensure that your code adheres to the project's coding standards.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

