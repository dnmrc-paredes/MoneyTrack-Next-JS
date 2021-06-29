import React, { FC } from 'react'

// Styles & Static
import styles from './modalForm.module.scss'

export const ModalForm: FC<{toggleModal: Function}> = ({children, toggleModal}) => {
    return (
        <div className={styles.root}>
            {children}
        </div>
    )
}