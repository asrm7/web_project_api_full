import closeIcon from "../images/CloseIcon.svg"
import iconSuccess from "../images/Corretc.png"
import iconError from "../images/Incorrect.png"
function InfoTooltip ({isSuccess,name,isOpen,onClose}){
  const icon = isSuccess ? iconSuccess : iconError;
  const messagge = isSuccess 
      ?'Vitória! Você precisa se registrar'
      : 'Ops, algo saiu errado! Por favor, tente novamente.';
  return(
    <div id={`modal-${name}`} className={`modal modal_type_${name} ${isOpen ? "modal__opened" : ""}`}>
          <div className="modal__contain">
            <img
              src={closeIcon}
              id={`close-icon-${name}`}
              alt="icone de encerrar"
              className="modal__close-icon info-close"
              onClick={onClose}
            />
           
              <img src={icon}
                alt=""
                className="modal__content_img"
                />
              <h4 className="modal__content-title">{messagge}</h4>
           
            
          </div>
        </div>
  )
}
export default InfoTooltip;