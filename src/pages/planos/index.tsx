import { Button, Flex, Heading, Text, useMediaQuery } from "@chakra-ui/react";
import Head from "next/head";
import { FiChevronLeft } from "react-icons/fi";
import { Sidebar } from "../../components/sidebar";
import { setupAPIClient } from "../../services/api";
import { getStripeJS } from "../../services/stripe-js";
import { canSSRAuth } from "../../utils/canSSRAuth";
import Link from "next/link";

interface PlanosProps {
  premium: boolean;
}

export default function Planos({ premium }: PlanosProps) {
  const [isMobile] = useMediaQuery("(max-width: 500px)");

  async function handleSubscribe() {
    if (premium) {
      return;
    }

    try {
      const apiClient = setupAPIClient();
      const response = await apiClient.post("/subscription");

      const { sessionId } = response.data;

      const stripe = await getStripeJS();
      await stripe.redirectToCheckout({ sessionId: sessionId });
    } catch (error) {
      console.log(error);
    }
  }

  async function handleCreatePortal() {
    try {
      if (!premium) {
        return;
      }

      const apiClient = setupAPIClient();
      const response = await apiClient.post("/create-portal");

      const { sessionId } = response.data;

      window.location.href = sessionId;
    } catch (error) {
      console.log(error.message);
    }
  }

  return (
    <>
      <Head>
        <title>Planos - BarberPRO</title>
      </Head>

      <Sidebar>
        <Flex
          w="100%"
          direction="column"
          align="flex-start"
          justify="flex-start"
        >
          <Flex
            direction={isMobile ? "column" : "row"}
            w="100%"
            alignItems={isMobile ? "flex-start" : "center"}
            justifyContent="flex-start"
            mb={isMobile ? 4 : 0}
          >
            <Link href="/profile">
              <Button
                bg="gray.700"
                _hover={{ bg: "gray.700" }}
                mr={4}
                p={4}
                display="flex"
                alignItems="center"
                justifyContent="center"
              >
                <FiChevronLeft size={24} color="#FFF" />
                Voltar
              </Button>
            </Link>

            <Heading fontSize={isMobile ? "22px" : "3xl"} color="white">
              Planos
            </Heading>
          </Flex>
        </Flex>

        <Flex
          pb={8}
          mt={4}
          maxW="780px"
          w="100%"
          direction="column"
          align="flex-start"
          justify="flex-start"
        >
          <Flex gap={4} w="100%" direction={isMobile ? "column" : "row"}>
            <Flex
              rounded={4}
              p={2}
              flex={1}
              bg="barber.400"
              direction="column"
              align="center"
            >
              <Heading fontSize="2xl" mt={5} mb={10} color="orange.900">
                Plano grátis
              </Heading>

              <Text fontWeight="medium" ml={4} mb={2}>
                Registrar cortes
              </Text>
              <Text fontWeight="medium" ml={4} mb={2}>
                Criar até 3 modelos de cortes
              </Text>
              <Text fontWeight="medium" ml={4} mb={2}>
                Editar dados do perfil
              </Text>
            </Flex>

            <Flex rounded={4} p={4} flex={1} bg="barber.400" direction="column">
              <Heading
                textAlign="center"
                fontSize="2xl"
                mt={5}
                mb={3}
                color="#31fb6a"
              >
                Plano premium
              </Heading>

              <Text fontWeight="medium" ml={4} mb={2}>
                Registrar cortes ilimitados
              </Text>
              <Text fontWeight="medium" ml={4} mb={2}>
                Criar modelos de cortes ilimitados
              </Text>
              <Text fontWeight="medium" ml={4} mb={2}>
                Editar dados do perfil
              </Text>
              <Text fontWeight="medium" ml={4} mb={2}>
                Receber todas as atualizações
              </Text>

              <Text
                fontWeight="bold"
                fontSize="2xl"
                color="#31fb6a"
                ml={4}
                mb={2}
              >
                R$ 10,90
              </Text>

              <Button
                bg={premium ? "white" : "button.cta"}
                m={2}
                mb={0}
                color="barber.400"
                onClick={() => handleSubscribe()}
                disabled={premium}
              >
                {premium ? "Você já é Premium!" : "Virar Premium"}
              </Button>

              {premium && (
                <Button
                  m={2}
                  bg="white"
                  color="barber.900"
                  fontWeight="bold"
                  onClick={() => handleCreatePortal()}
                >
                  Alterar assinatura
                </Button>
              )}
            </Flex>
          </Flex>
        </Flex>
      </Sidebar>
    </>
  );
}

export const getServerSideProps = canSSRAuth(async (ctx) => {
  try {
    const apiClient = setupAPIClient(ctx);
    const response = await apiClient.get("/me");

    return {
      props: {
        premium:
          response.data?.subscriptions?.status === "active" ? true : false,
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
