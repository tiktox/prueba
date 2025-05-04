import React from 'react';
import { useNavigate } from 'react-router-dom';
import CreatePin from '../components/pins/CreatePin';

const CreatePinPage: React.FC = () => {
  const navigate = useNavigate();
  
  const handleCancel = () => {
    navigate(-1);
  };
  
  return (
    <div className="max-w-6xl mx-auto py-4">
      <CreatePin onCancel={handleCancel} />
    </div>
  );
};

export default CreatePinPage;