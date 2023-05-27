import Head from "next/head";
import {
  Button,
  Flex,
  Heading,
  Text,
  Link as ChakraLink,
  useMediaQuery,
  useDisclosure,
} from "@chakra-ui/react";
import { canSSRAuth } from "../../utils/canSSRAuth";
import { Sidebar } from "../../components/sidebar";
import { IoMdPerson } from "react-icons/io";
import Link from "next/link";
import { setupAPIClient } from "../../services/api";
import { useState } from "react";
import ModalInfo from "../../components/modal";

export interface ScheduleItem {
  id: string;
  customer: string;
  haircut: {
    id: string;
    name: string;
    price: string | number;
    user_id: string;
  };
}

interface DashboardProps {
  schedule: ScheduleItem[];
}

export default function Dashboard({ schedule }: DashboardProps) {
  const [isMobile] = useMediaQuery("(max-width: 500px)");
  const [list, setList] = useState(schedule);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [service, setService] = useState<ScheduleItem>();

  function openModal(item: ScheduleItem) {
    setService(item);
    onOpen();
  }

  async function handleFinish(id: string) {
    try {
      const apiClient = setupAPIClient();
      await apiClient.delete("/schedule/finish", {
        params: {
          schedule_id: id,
        },
      });

      const filterItem = list.filter((item) => {
        return item?.id !== id;
      });

      setList(filterItem);
      onClose();
    } catch (error) {
      console.log(error);
      onClose();
    }
  }

  return (
    <>
      <Head>
        <title>Minha Barbearia - BarberPRO</title>
      </Head>

      <Sidebar>
        <Flex direction="column" align="flex-start" justify="flex-start">
          <Flex w="100%" direction="row" align="center" justify="flex-start">
            <Heading fontSize="3xl" mt={4} mb={4} mr={4} color="orange.900">
              Agenda
            </Heading>

            <Link href="/new">
              <Button bg="gray.700" _hover={{ bg: "gray.700" }}>
                Registrar
              </Button>
            </Link>
          </Flex>

          {list.map((item) => (
            <ChakraLink
              key={item?.id}
              w="100%"
              m={0}
              p={0}
              mt={1}
              bg="transparent"
              style={{ textDecoration: "none" }}
              onClick={() => openModal(item)}
            >
              <Flex
                w="85%"
                direction={isMobile ? "column" : "row"}
                p={6}
                rounded={4}
                mb={4}
                bg="barber.400"
                justify="space-between"
                align={isMobile ? "flex-start" : "center"}
              >
                <Flex
                  direction="row"
                  mb={isMobile ? 2 : 0}
                  align="center"
                  justify="center"
                >
                  <IoMdPerson size={28} color="#ee9a1d" />
                  <Text fontWeight="bold" ml={4} noOfLines={1}>
                    {item?.customer}
                  </Text>
                </Flex>

                <Text fontWeight="bold" mb={isMobile ? 2 : 0}>
                  {item?.haircut?.name}
                </Text>
                <Text fontWeight="bold" mb={isMobile ? 2 : 0}>
                  R$ {Number(item?.haircut?.price).toFixed(2)}
                </Text>
              </Flex>
            </ChakraLink>
          ))}
        </Flex>
      </Sidebar>

      <ModalInfo
        isOpen={isOpen}
        onOpen={onOpen}
        onClose={onClose}
        data={service}
        finishService={() => handleFinish(service?.id)}
      />
    </>
  );
}

export const getServerSideProps = canSSRAuth(async (ctx) => {
  try {
    const apiClient = setupAPIClient(ctx);
    const response = await apiClient.get("/schedule/list");

    return {
      props: {
        schedule: response.data,
      },
    };
  } catch (error) {
    console.log(error);

    return {
      props: {
        schedule: [],
      },
    };
  }
});
