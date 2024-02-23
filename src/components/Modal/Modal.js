import ReactModal from 'react-modal';
import { ClearIcon } from '../Icons';

const customStyles = {
    content: {
        top: '50%',
        left: '50%',
        right: 'auto',
        bottom: 'auto',
        marginRight: '-50%',
        transform: 'translate(-50%, -50%)',
    },
};

ReactModal.setAppElement('#root');

function Modal({ isOpen, onAfterOpen, onRequestClose, contentLabel, children }) {
    return (
        <ReactModal
            isOpen={isOpen}
            onAfterOpen={onAfterOpen}
            onRequestClose={onRequestClose}
            style={customStyles}
            contentLabel={contentLabel}
        >
            <div className="relative min-w-[420px]">
                <h1 className="text-center text-[20px] font-medium">{contentLabel}</h1>
                {children}
                <span className="absolute top-[-10px] right-[-10px] cursor-pointer" onClick={onRequestClose}>
                    <ClearIcon />
                </span>
            </div>
        </ReactModal>
    );
}

export default Modal;
