import Head from "next/head";
import { Sidebar } from "../../../components/sidebar";
import {
  Button,
  Flex,
  Heading,
  Input,
  Text,
  useMediaQuery,
} from "@chakra-ui/react";
import Link from "next/link";
import { FiChevronLeft } from "react-icons/fi";
import { setupAPIClient } from "../../../services/api";
import { canSSRAuth } from "../../../utils/canSSRAuth";
import { useState } from "react";
import Router from "next/router";

interface NewProps {
  subscription: boolean;
  count: number;
}

export default function New({ subscription, count }: NewProps) {
  const [isMobile] = useMediaQuery("(max-width: 500px)");
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");

  async function handleRegister() {
    if (name === "" || price === "") {
      return;
    }

    try {
      const apiClient = setupAPIClient();
      await apiClient.post("/haircut", {
        name,
        price: Number(price),
      });

      Router.push("/haircuts");
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <>
      <Head>
        <title>Novo corte - BarberPRO</title>
      </Head>

      <Sidebar>
        <Flex
          direction="column"
          alignItems="flex-start"
          justifyContent="flex-start"
        >
          <Flex
            direction={isMobile ? "column" : "row"}
            w="100%"
            align={isMobile ? "flex-start" : "center"}
            mb={isMobile ? 4 : 0}
          >
            <Link href="/haircuts">
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

            <Heading
              color="white"
              mt={4}
              mb={4}
              mr={4}
              fontSize={isMobile ? "28px" : "3xl"}
            >
              Novo corte
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
              placeholder="Nome do corte"
              size="lg"
              type="text"
              w="85%"
              bg="gray.900"
              mb={3}
              value={name}
              onChange={(e) => setName(e.target.value)}
            />

            <Input
              placeholder="Valor do corte"
              size="lg"
              type="text"
              w="85%"
              bg="gray.900"
              mb={4}
              value={price}
              onChange={(e) => setPrice(e.target.value)}
            />

            <Button
              w="85%"
              size="lg"
              color="gray.900"
              fontSize={20}
              bg="button.cta"
              _hover={{ bg: "#ffb13e" }}
              disabled={!subscription && count >= 3}
              onClick={handleRegister}
            >
              Cadastrar
            </Button>

            {!subscription && count >= 3 && (
              <Flex direction="row" align="center" justifyContent="center">
                <Text>Você atingiu seu limite de cortes!</Text>

                <Link href="/planos">
                  <Text
                    fontWeight="bold"
                    color="#31fb6a"
                    cursor="pointer"
                    ml={2}
                  >
                    Seja premium
                  </Text>
                </Link>
              </Flex>
            )}
          </Flex>
        </Flex>
      </Sidebar>
    </>
  );
}

export const getServerSideProps = canSSRAuth(async (ctx) => {
  try {
    const apiClient = setupAPIClient(ctx);
    const response = await apiClient.get("/haircut/check");
    const count = await apiClient.get("/haircut/count");

    return {
      props: {
        subscription:
          response.data?.subscriptions?.status === "active" ? true : false,
        count: count.data,
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
