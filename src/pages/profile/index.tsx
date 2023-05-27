import Head from "next/head";
import { Flex, Text, Heading, Box, Input, Button } from "@chakra-ui/react";
import { Sidebar } from "../../components/sidebar";
import Link from "next/link";
import { canSSRAuth } from "../../utils/canSSRAuth";
import { useContext, useState } from "react";
import { AuthContext } from "../../contexts/AuthContext";
import { setupAPIClient } from "../../services/api";

interface UserProps {
  id: string;
  name: string;
  email: string;
  address: string | null;
}

interface ProfileProps {
  user: UserProps;
  premium: boolean;
}

export default function Profile({ user, premium }: ProfileProps) {
  const { logoutUser } = useContext(AuthContext);
  const [name, setName] = useState(user && user?.name);
  const [address, setAddress] = useState(user && user?.address);

  async function handleLogout() {
    await logoutUser();
  }

  async function handleUpdate() {
    if (name === "") {
      return;
    }

    try {
      const apiClient = setupAPIClient();

      await apiClient.put("/update", {
        name,
        address,
      });

      alert("Dados alterados com sucesso!");
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <>
      <Head>
        <title>Minha Conta - BarberPRO</title>
      </Head>

      <Sidebar>
        <Flex
          direction="column"
          alignItems="flex-start"
          justifyContent="flex-start"
        >
          <Flex
            w="100%"
            direction="row"
            alignItems="center"
            justifyContent="flex-start"
          >
            <Heading fontSize="3xl" mt={4} mb={4} mr={4} color="orange.900">
              Minha Conta
            </Heading>
          </Flex>

          <Flex
            pt={8}
            pb={8}
            bg="barber.400"
            maxW="700px"
            w="100%"
            direction="column"
            alignItems="center"
            justifyContent="center"
          >
            <Flex direction="column" w="85%">
              <Text mb={2} fontSize="xl" fontWeight="bold" color="white">
                Nome da barbearia:
              </Text>

              <Input
                w="100%"
                background="gray.900"
                placeholder="Nome"
                size="lg"
                type="text"
                mb={4}
                value={name}
                onChange={(e) => setName(e.target.value)}
              />

              <Text mb={2} fontSize="xl" fontWeight="bold" color="white">
                Endereço:
              </Text>

              <Input
                w="100%"
                background="gray.900"
                placeholder="Endereço"
                size="lg"
                type="text"
                mb={4}
                value={address}
                onChange={(e) => setAddress(e.target.value)}
              />

              <Text mb={2} fontSize="xl" fontWeight="bold" color="white">
                Plano atual
              </Text>

              <Flex
                direction="row"
                w="100%"
                mb={3}
                p={1}
                pr={2.5}
                borderWidth={1}
                rounded={6}
                background="barber.900"
                alignItems="center"
                justifyContent="space-between"
              >
                <Text
                  p={2}
                  fontSize="lg"
                  color={premium ? "#fba931" : "#4dffb4"}
                >
                  Plano {premium ? "Premium" : "Grátis"}
                </Text>
                <Link href="/planos">
                  <Box
                    cursor="pointer"
                    p={1}
                    pl={2}
                    pr={2}
                    background="#00cd52"
                    rounded={4}
                    color="white"
                  >
                    Mudar plano
                  </Box>
                </Link>
              </Flex>

              <Button
                w="100%"
                mt={3}
                mb={2}
                bg="button.cta"
                size="lg"
                _hover={{ bg: "#ffb13e" }}
                onClick={handleUpdate}
              >
                Salvar
              </Button>

              <Button
                w="100%"
                mb={2}
                bg="transparent"
                borderWidth={2}
                borderColor="red.500"
                color="red.500"
                size="lg"
                _hover={{ bg: "transparent" }}
                onClick={handleLogout}
              >
                Sair
              </Button>
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

    const user = {
      id: response.data.id,
      name: response.data.name,
      email: response.data.email,
      address: response.data.address,
    };

    return {
      props: {
        user: user,
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
