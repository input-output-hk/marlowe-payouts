// App.tsx
import React, { useState } from 'react';
import ToastMessage from './Adapters/ToastMessage';
import { ConnectionWallet } from './Connection';
import { Footer } from './Footer/';
import { About } from './Pages/About';
import { Available } from './Pages/Available';
import { Withdrawn } from './Pages/Withdrawn';
import { defaultFooterLinks, defaultSocialMediaLinks } from './Footer/Default';
import { ICON_SIZES } from './Adapters/Icon';

type AppProps = {
  runtimeURL: string;
  marloweScanURL : string;
  cardanoScanURL : string;
}

type Page = "About" | "Avalaible Withdrawals" | "Withdrawal History"

const aboutPage : Page = "About"
const isAboutPage = (page:Page) => page === aboutPage
const payoutsAvailablePage : Page = "Avalaible Withdrawals"
const isPayoutsAvailablePage = (page:Page) => page === payoutsAvailablePage
const payoutsWithdrawnPage :  Page = "Withdrawal History"
const isPayoutsWithdrawnPage = (page:Page) => page === payoutsWithdrawnPage

const App: React.FC<AppProps> = ({runtimeURL,marloweScanURL,cardanoScanURL}) => {
  const selectedWalletExtensionName = localStorage.getItem('walletProvider');
  const [isWaitingConfirmation, setWaitingConfirmation] = useState(false);
  const [isConnected, setIsConnected] = useState<boolean>(selectedWalletExtensionName?true:false); 
  const [currentPage, setCurrentPage] = useState<Page>("About"); 
  const [toasts, setToasts] = useState<any[]>([]);
  const isAboutPageDisabled = isWaitingConfirmation || isAboutPage(currentPage)
  const isPayoutsAvailablePageDisabled = isWaitingConfirmation || !isConnected || isPayoutsAvailablePage(currentPage)
  const isPayoutsWithdrawnPageDisabled = isWaitingConfirmation || !isConnected || isPayoutsWithdrawnPage(currentPage)


  const setAndShowToast = (title: string, message: React.ReactNode) => {
    const newToast = { id: new Date().getTime(), title, message };
    setToasts(prevToasts => [...prevToasts, newToast]);
  }

  const removeToast = (id: number) => {
    setToasts(prevToasts => prevToasts.filter(toast => toast.id !== id));
  }

  return (
    <div className="container">
      <div className="header">
        <div style={{width:"700px"}} className="d-flex justify-content-start align-items-baseline" >
            <span style={{margin:"10px"}} ><img
              src="/images/header/marlowe.svg"
              alt="Marlowe"
              height={ICON_SIZES.XL}
              className="hidden md:block"
            /></span>
            <span ><h1 style={{margin:0}}>Payouts Prototype</h1> </span>
            <span ><h3 style={{margin:0,paddingLeft:"10px"}}>/ {currentPage}</h3> </span>
          </div>
          <ConnectionWallet onConnect={() => setIsConnected(true)} onDisconnect={() => {setCurrentPage(aboutPage);setIsConnected(false)}} runtimeURL={runtimeURL} setAndShowToast={setAndShowToast} /> 
        </div>
        <div> <button className="btn btn-link" disabled={isAboutPageDisabled}             onClick={() => setCurrentPage(aboutPage)}>{aboutPage}</button> 
            | <button className="btn btn-link" disabled={isPayoutsAvailablePageDisabled}  onClick={() => setCurrentPage(payoutsAvailablePage)}>{payoutsAvailablePage}</button> 
            | <button className="btn btn-link" disabled={isPayoutsWithdrawnPageDisabled}  onClick={() => setCurrentPage(payoutsWithdrawnPage)}>{payoutsWithdrawnPage}</button> 
            <hr></hr>
          </div>
          {isAboutPage(currentPage)?
            <About/>:(isPayoutsAvailablePage(currentPage)?
              <Available onWaitingConfirmation={() => setWaitingConfirmation(true) } onConfirmation={() => setWaitingConfirmation(false)} runtimeURL={runtimeURL} cardanoScanURL={cardanoScanURL} marloweScanURL={marloweScanURL} setAndShowToast={setAndShowToast} /> 
              : <Withdrawn runtimeURL={runtimeURL} marloweScanURL={marloweScanURL} setAndShowToast={setAndShowToast} cardanoScanURL={cardanoScanURL} />
          )}   
        <Footer footerLinks={defaultFooterLinks} socialMediaLinks={defaultSocialMediaLinks} />
      <div className="toast-container position-fixed bottom-0 end-0 p-3">
        {toasts.map(toast => (
          <ToastMessage
            key={toast.id}
            id={toast.id}
            title={toast.title}
            message={toast.message}
            show={true}
            isDanger={toast.isDanger}
            onClose={() => removeToast(toast.id)}
          />
        ))}
      </div>
    </div>);
};



export default App;

