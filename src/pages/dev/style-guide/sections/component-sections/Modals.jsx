import React, { useState } from 'react';
import { Modal, Alert } from '../../../../../components/ui';

export default function Modals() {
  const [showBasicModal, setShowBasicModal] = useState(false);
  const [showAlertModal, setShowAlertModal] = useState(false);
  const [showModalWithFooter, setShowModalWithFooter] = useState(false);
  const [showLargeModal, setShowLargeModal] = useState(false);

  return (
    <div className="component-category">
      <h3 className="component-category__title">Modals</h3>

      <h4 className="modal-demo__subsection-title">Modal Sizes</h4>
      <div className="modal-demo__buttons">
        <button className="btn btn--primary" onClick={() => setShowBasicModal(true)}>
          Open Basic Modal
        </button>
        <button className="btn btn--secondary" onClick={() => setShowLargeModal(true)}>
          Open Large Modal
        </button>
        <button className="btn btn--tertiary" onClick={() => setShowModalWithFooter(true)}>
          Modal with Footer
        </button>
        <button className="btn btn--ghost" onClick={() => setShowAlertModal(true)}>
          Modal with Alert
        </button>
      </div>

      <Modal
        isOpen={showBasicModal}
        onClose={() => setShowBasicModal(false)}
        title="Basic Modal"
        size="md"
      >
        <p className="modal-demo__content">
          This is a basic modal dialog with a title and close button. Click outside the modal or press ESC to close it.
        </p>
      </Modal>

      <Modal
        isOpen={showLargeModal}
        onClose={() => setShowLargeModal(false)}
        title="Large Modal"
        size="lg"
      >
        <p className="modal-demo__content modal-demo__content--spaced">
          This is a large modal that takes up more screen space. Perfect for forms or detailed content.
        </p>
        <p className="modal-demo__content">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
        </p>
      </Modal>

      <Modal
        isOpen={showModalWithFooter}
        onClose={() => setShowModalWithFooter(false)}
        title="Confirm Action"
        footer={
          <>
            <button className="btn btn--secondary" onClick={() => setShowModalWithFooter(false)}>
              Cancel
            </button>
            <button className="btn btn--primary" onClick={() => {
              alert('Action confirmed!');
              setShowModalWithFooter(false);
            }}>
              Confirm
            </button>
          </>
        }
      >
        <p className="modal-demo__content">
          Are you sure you want to proceed with this action? This cannot be undone.
        </p>
      </Modal>

      <Modal
        isOpen={showAlertModal}
        onClose={() => setShowAlertModal(false)}
        title="Important Notice"
      >
        <Alert type="warning" variant="modal" dismissible onDismiss={() => setShowAlertModal(false)}>
          <strong>Warning</strong><br />
          This modal contains an alert using the "modal" variant, which has no left border.
        </Alert>
        <p className="modal-demo__content modal-demo__content--spaced-top">
          Modal alerts are designed to integrate seamlessly within modal dialogs by removing the left border.
        </p>
      </Modal>
    </div>
  );
}
