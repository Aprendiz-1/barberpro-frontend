import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Text,
  Button,
  Flex,
} from "@chakra-ui/react";
import { FiUser, FiScissors } from "react-icons/fi";
import { FaMoneyBillAlt } from "react-icons/fa";
import { ScheduleItem } from "../../pages/dashboard";

interface ModalProps {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
  data: ScheduleItem;
  finishService: () => Promise<void>;
}

export default function ModalInfo({
  isOpen,
  onOpen,
  onClose,
  data,
  finishService,
}: ModalProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />

      <ModalContent bg="barber.400">
        <ModalHeader>Próximo</ModalHeader>
        <ModalCloseButton />

        <ModalBody>
          <Flex align="center" mb={3}>
            <FiUser size={28} color="#ffb13e" />
            <Text ml={3} fontSize="2xl" fontWeight="bold" color="white">
              {data?.customer}
            </Text>
          </Flex>

          <Flex align="center" mb={3}>
            <FiScissors size={28} color="#FFF" />
            <Text ml={3} fontSize="large" fontWeight="bold" color="white">
              {data?.haircut?.name}
            </Text>
          </Flex>

          <Flex align="center" mb={3}>
            <FaMoneyBillAlt size={28} color="#46ef75" />
            <Text ml={3} fontSize="large" fontWeight="bold" color="white">
              R$ {Number(data?.haircut?.price).toFixed(2)}
            </Text>
          </Flex>

          <ModalFooter>
            <Button
              bg="button.cta"
              _hover={{ bg: "#ffb13e" }}
              color="#FFF"
              mr={-7}
              onClick={() => finishService()}
            >
              Finalizar serviço
            </Button>
          </ModalFooter>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}
