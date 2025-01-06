import React, { useEffect } from "react";
import ReactDOM from "react-dom";
import { twMerge } from "tailwind-merge";

const CustomModal = (props) => {
    useEffect(() => {
        const handleOutsideClick = (event) => {
            if (event.target.classList.contains("modal-container")) {
                props?.onClose();
            }
        };

        if (props?.isOpen) {
            document.addEventListener("click", handleOutsideClick);
        }

        return () => {
            document.removeEventListener("click", handleOutsideClick);
        };
    }, [props?.isOpen, props?.onClose]);

    if (!props?.isOpen) return null;

    return ReactDOM.createPortal(
        <div className={twMerge(`fixed top-0 left-0 w-full h-full bg-black bg-opacity-20 flex  modal-container backdrop-blur-[1px] z-50 items-center justify-center`, props?.modalClassName)}>
            <div className={twMerge(`rounded-lg p-4 md:p-8`, props?.className)}>
                <div className="flex justify-between items-center m-2">
                    <h2 className="text-xl font-bold">{props?.title}</h2>
                    {props?.onClose && <button
                        className="bg-white text-black w-10 h-10 rounded-full"
                        onClick={props?.onClose}
                    >
                        <span className="material-symbols-outlined mt-2 hover:font-bold">
                            close
                        </span>
                    </button>}
                </div>
                {props?.children}
            </div>
        </div>
        , document.getElementById("modal-root"));
};

export default CustomModal;
