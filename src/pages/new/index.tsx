import {
  Button,
  Flex,
  Heading,
  Input,
  Select,
  useMediaQuery,
} from "@chakra-ui/react";
import Head from "next/head";
import { useRouter } from "next/router";
import { ChangeEvent, useState } from "react";
import { FiChevronLeft } from "react-icons/fi";
import { Sidebar } from "../../components/sidebar";
import { setupAPIClient } from "../../services/api";
import { canSSRAuth } from "../../utils/canSSRAuth";
import Link from "next/link";

interface HaircutProps {
  id: string;
  name: string;
  price: string | number;
  status: boolean;
  user_id: string;
}

interface NewProps {
  haircuts: HaircutProps[];
}

export default function New({ haircuts }: NewProps) {
  const router = useRouter();
  const [isMobile] = useMediaQuery("(max-width: 500px)");
  const [customer, setCustomer] = useState("");
  const [haircutSelected, setHaircutSelected] = useState(haircuts[0]);

  function handleChangeSelect(id: string) {
    const haircutItem = haircuts.find((item) => item.id === id);
    setHaircutSelected(haircutItem);
  }

  async function handleRegister() {
    if (customer === "") {
      return;
    }

    try {
      const apiClient = setupAPIClient();

      await apiClient.post("/schedule", {
        customer,
        haircut_id: haircutSelected?.id,
      });

      router.push("/dashboard");
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <>
      <Head>
        <title>Novo agendamento - BarberPRO</title>
      </Head>

      <Sidebar>
        <Flex direction="column" align="flex-start" justify="flex-start">
          <Flex
            direction={isMobile ? "column" : "row"}
            w="100%"
            align={isMobile ? "flex-start" : "center"}
            mb={isMobile ? 4 : 0}
          >
            <Link href="/dashboard">
              <Button
                bg="gray.700"
                _hover={{ bg: "gray.700" }}
                p={4}
                display="flex"
                alignItems="center"
                justifyContent="center"
                mr={4}
              >
                <FiChevronLeft size={24} color="#FFF" />
                Voltar
              </Button>
            </Link>

            <Heading fontSize="3xl" mt={4} mb={4} mr={4}>
              Novo agendamento
            </Heading>
          </Flex>

          <Flex
            maxW="550px"
            bg="barber.400"
            w="100%"
            align="center"
            justify="center"
            pt={9}
            pb={9}
            direction="column"
          >
            <Input
              placeholder="Nome do cliente"
              w="85%"
              mb={3}
              size="lg"
              type="text"
              bg="barber.900"
              value={customer}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                setCustomer(e.target.value)
              }
            />

            <Select
              mb={3}
              size="lg"
              w="85%"
              bg="barber.900"
              onChange={(e) => handleChangeSelect(e.target.value)}
            >
              {haircuts?.map((item) => (
                <option
                  style={{ backgroundColor: "#FFF", color: "#000" }}
                  key={item?.id}
                  value={item?.id}
                >
                  {item?.name}
                </option>
              ))}
            </Select>

            <Button
              w="85%"
              size="lg"
              fontSize={20}
              color="gray.900"
              bg="button.cta"
              _hover={{ bg: "#ffb13e" }}
              onClick={handleRegister}
            >
              Cadastrar
            </Button>
          </Flex>
        </Flex>
      </Sidebar>
    </>
  );
}

export const getServerSideProps = canSSRAuth(async (ctx) => {
  try {
    const apiClient = setupAPIClient(ctx);
    const response = await apiClient.get("/haircut/list", {
      params: {
        status: true,
      },
    });

    if (response.data === null) {
      return {
        redirect: {
          destination: "/dashboard",
          permanent: false,
        },
      };
    }

    return {
      props: {
        haircuts: response.data,
      },
    };
  } catch (error) {
    console.log(error);

    return {
      redirect: {
        destination: "/dashboard",
        permanent: false,
      },
    };
  }
});
