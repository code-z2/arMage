'use client';
import React, { useEffect, useState } from 'react';
import {
  Box,
  Button,
  Container,
  Divider,
  Flex,
  Heading,
  Input,
  Text,
  Textarea,
  ChakraProvider,
  Image,
} from '@chakra-ui/react';

import Arweave from 'arweave';

const arweave = new Arweave({
  host: 'ar-io.net',
  port: 443,
  protocol: 'https',
});

const Upload = () => {
  const [uploadedImage, setUploadedImage] = useState(null);
  const [udlTag, setUdlTag] = useState(`
  [
    {License: "yRj4a5KMctX_uOmKWCFJIjmY8DeJcusVk6-HzLiM_t8"}
  ]
  `);
  const [imageUrl, setImageUrl] = useState('');

  const handleImageUpload = (event: any) => {
    const file = event.target.files[0];
    const reader: any = new FileReader();

    reader.onloadend = () => {
      setUploadedImage(reader.result);
    };

    if (file) {
      reader.readAsDataURL(file);
    }
  };

  const handleDragOver = (event: any) => {
    event.preventDefault();
  };

  const handleDrop = (event: any) => {
    event.preventDefault();
    const file = event.dataTransfer.files[0];
    const reader: any = new FileReader();

    reader.onloadend = () => {
      setUploadedImage(reader.result);
    };

    if (file) {
      reader.readAsDataURL(file);
    }
  };

  const handleUrlImport = () => {
    if (!imageUrl) return;

    fetch(imageUrl)
      .then((response) => response.blob())
      .then((blob) => {
        const reader: any = new FileReader();

        reader.onloadend = () => {
          setUploadedImage(reader.result);
        };

        reader.readAsDataURL(blob);
      })
      .catch((error) => console.error('Error fetching image:', error));
  };

  const handleUdlEdit = (event: any) => {
    setUdlTag(event.target.value);
  };

  const upload = async () => {
    if (!uploadedImage) return;
    try {
      let transaction = await arweave.createTransaction({
        data: uploadedImage,
      });
      transaction.addTag('Content-Type', 'image/png');
      transaction.addTag('License', 'yRj4a5KMctX_uOmKWCFJIjmY8DeJcusVk6-HzLiM_t8');
      transaction = await window.arweaveWallet.sign(transaction);
      const response = await arweave.transactions.post(transaction);
      console.log(response);
    } catch (error) {
      console.log(error);
    }
    setUploadedImage(null);
  };

  useEffect(() => {
    upload();
  }, [uploadedImage]);

  return (
    <ChakraProvider>
      <Container maxW="1000px" py="8" rounded="lg" shadow="lg">
        <Flex direction="column" align="center" justify="center">
          <Heading as="h2" size="lg" mb="4">
            Upload Image
          </Heading>
          <Input type="file" onChange={handleImageUpload} mb="2" />
          <Text>Or</Text>
          <Box
            border="2px dashed #ccc"
            borderRadius="md"
            p="6"
            my="2"
            w="200px"
            h="100px"
            display="flex"
            justifyContent="center"
            alignItems="center"
            onDragOver={(event) => handleDragOver(event)}
            onDrop={(event) => handleDrop(event)}
          >
            Drop File Here
          </Box>
          <Divider my="4" />
          <Input
            type="url"
            placeholder="Enter Image URL"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            mb="2"
          />
          <Button colorScheme="blue" onClick={handleUrlImport} mb="4">
            Import from URL
          </Button>
        </Flex>
        <Divider my="6" />
        <Flex direction="column" align="center" justify="center">
          <Heading as="h2" size="lg" mb="4">
            UDL Editor
          </Heading>
          <Textarea rows={10} cols={30} value={udlTag} onChange={handleUdlEdit} />
        </Flex>
        {uploadedImage && (
          <Flex direction="column" align="center" justify="center" mt="6">
            <Heading as="h2" size="lg" mb="4">
              Image Preview
            </Heading>
            <Box maxW="300px">
              <Image src={uploadedImage} alt="Uploaded" />
            </Box>
          </Flex>
        )}
      </Container>
    </ChakraProvider>
  );
};

export default Upload;
