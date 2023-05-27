import Head from "next/head";
import Link from "next/link";
import {
  Flex,
  Text,
  Heading,
  Button,
  useMediaQuery,
  Input,
  Stack,
  Switch,
} from "@chakra-ui/react";
import { Sidebar } from "../../components/sidebar";
import { FiChevronLeft } from "react-icons/fi";
import { canSSRAuth } from "../../utils/canSSRAuth";
import { setupAPIClient } from "../../services/api";
import { ChangeEvent, useState } from "react";

interface HaircutProps {
  id: string;
  name: string;
  price: string | number;
  status: boolean;
  user_id: string;
}

interface SubscriptionProps {
  id: string;
  status: string;
}

interface EditProps {
  haircut: HaircutProps;
  subscription: SubscriptionProps | null;
}

export default function EditHaircut({ haircut, subscription }: EditProps) {
  const [isMobile] = useMediaQuery("(max-width: 500px)");
  const [name, setName] = useState(haircut?.name);
  const [price, setPrice] = useState(haircut?.price);
  const [status, setStatus] = useState(haircut?.status);
  const [disableHaircut, setDisableHaircut] = useState(
    haircut?.status ? "disabled" : "enabled"
  );

  function handleChangeStatus(e: ChangeEvent<HTMLInputElement>) {
    if (e.target.value === "disabled") {
      setDisableHaircut("enabled");
      setStatus(false);
    } else {
      setDisableHaircut("disabled");
      setStatus(true);
    }
  }

  async function handleUpdate() {
    if (name === "" || price === "") {
      return;
    }

    try {
      const apiClient = setupAPIClient();
      await apiClient.put("/haircut/update", {
        name,
        price: Number(price),
        status,
        haircut_id: haircut?.id,
      });
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <>
      <Head>
        <title>Editar corte - BarberPRO</title>
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
            alignItems={isMobile ? "flex-start" : "center"}
            justifyContent="flex-start"
            mb={isMobile ? 4 : 0}
          >
            <Link href="/haircuts">
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
              Editar corte
            </Heading>
          </Flex>

          <Flex
            mt={4}
            maxW="550px"
            pt={9}
            pb={7}
            w="100%"
            bg="barber.400"
            direction="column"
            align="center"
            justify="center"
          >
            <Flex w="85%" direction="column">
              <Input
                placeholder="Nome do corte"
                bg="gray.900"
                mb={3}
                size="lg"
                type="text"
                w="100%"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />

              <Input
                placeholder="Valor do corte"
                bg="gray.900"
                mb={4}
                size="lg"
                type="number"
                w="100%"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
              />

              <Stack mb={4} align="center" direction="row">
                <Text fontWeight="bold">Desativar corte</Text>
                <Switch
                  size="lg"
                  colorScheme="red"
                  value={disableHaircut}
                  isChecked={disableHaircut === "disabled" ? false : true}
                  onChange={(e: ChangeEvent<HTMLInputElement>) =>
                    handleChangeStatus(e)
                  }
                />
              </Stack>

              <Button
                mb={6}
                w="100%"
                bg="button.cta"
                color="gray.900"
                _hover={{ bg: "#ffb13e" }}
                disabled={subscription?.status !== "active"}
                onClick={handleUpdate}
              >
                Salvar
              </Button>

              {subscription?.status !== "active" && (
                <Flex direction="row" align="center" justify="center">
                  <Link href="/planos">
                    <Text
                      cursor="pointer"
                      fontWeight="bold"
                      mr={1}
                      color="#31fb6a"
                    >
                      Seja premium
                    </Text>
                  </Link>

                  <Text>e tenha todos os acessos liberados</Text>
                </Flex>
              )}
            </Flex>
          </Flex>
        </Flex>
      </Sidebar>
    </>
  );
}

export const getServerSideProps = canSSRAuth(async (ctx) => {
  const { id } = ctx.params;

  try {
    const apiClient = setupAPIClient(ctx);
    const check = await apiClient.get("/haircut/check");

    const response = await apiClient.get("/haircut/detail", {
      params: {
        haircut_id: id,
      },
    });

    return {
      props: {
        haircut: response.data,
        subscription: check.data?.subscriptions,
      },
    };
  } catch (error) {
    console.log(error);

    return {
      redirect: {
        destination: "/haircuts",
        permanent: false,
      },
    };
  }
});
