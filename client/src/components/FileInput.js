import { useState, useEffect } from 'react';
import { Button, Box } from '@mui/material';
import {useTranslation} from "react-i18next";

// Håndterer nye bilder før opplasting. Viser frem bilde som en forrhåndsvisning.
const FileInput = ({imageData, setImage}) => {
  const { t } = useTranslation();

  const [imagegege, setImagegege] = useState(imageData ? imageData : null);
  const [imageUrl, setImageUrl] = useState(imageData ? imageData.url : null);

  useEffect(() => {
    if (imagegege) {
      console.log(imagegege)
      setImageUrl(URL.createObjectURL(imagegege));
    }
  }, [imagegege]);
  
  const handleChange = (event) =>{
    setImagegege(event.target.files[0])
    setImage(event.target.files[0])
  }

  return (
    <>
      <input
        accept="image/*"
        type="file"
        id="select-image"
        style={{ display: 'none' }} 
        onChange={handleChange}
      />
      <label htmlFor="select-image">
        <Button variant="contained" color="primary" component="span">
          {t('upload_image')}
        </Button>
      </label>
      {imageUrl && imagegege && (
        <Box mt={2} textAlign="center">
          <img src={imageUrl} alt={imagegege.name} height="100px" />
        </Box>
      )}
    </>
  );
};

export default FileInput;