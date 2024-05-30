import React from 'react'
import {
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  IconButton,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuGroup,
  MenuDivider
} from '@chakra-ui/react'
import { useAppDispatch, useAppSelector } from '@/store/lib/storeHooks'
import { pushAdapter, defaultAdapters } from '@/store/lib/features/adaptersStore'
import { AddIcon } from '@chakra-ui/icons'


function AddNewAdapterButton() {
  const adapters = useAppSelector(state => state.adapters.adapters)
  const dispatch = useAppDispatch();


  const { isOpen, onOpen, onClose } = useDisclosure()
  const handleOpen = () => {
    isOpen ? onClose() : onOpen()
  }

  const addAdapter = async () => {
    await dispatch(pushAdapter({ address: `Soroswap adapter ${adapters.length + 1}`, value: 0 }))
    isOpen ? onClose() : onOpen()
  }
  return (
    <>
      <Button colorScheme="green" size="lg" mt={4} onClick={handleOpen}>
        Add adapter +
      </Button>
      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay backdropFilter='blur(10px)' />
        <ModalContent >
          <ModalHeader>Add new adapter</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Menu>
              <MenuButton as={Button} colorScheme='green'>
                Profile
              </MenuButton>
              <MenuList>
                <MenuGroup title=''>
                  {defaultAdapters.map((adapter, index) => (
                    <MenuItem key={index}>{adapter.name}</MenuItem>
                  ))}
                </MenuGroup>
                <MenuDivider />
                <MenuGroup>
                  <MenuItem>Add custom adapter...</MenuItem>
                </MenuGroup>
              </MenuList>
            </Menu>
          </ModalBody>

          <ModalFooter>
            <Button variant='ghost' mr={3} onClick={onClose}>
              Close
            </Button>
            <IconButton
              aria-label='add_adapter'
              colorScheme='green'
              icon={<AddIcon />}
              onClick={addAdapter}
            />
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}

export default AddNewAdapterButton