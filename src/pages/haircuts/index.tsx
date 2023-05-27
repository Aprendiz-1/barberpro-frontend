import Head from "next/head";
import { Sidebar } from "../../components/sidebar";
import {
  Button,
  Flex,
  Heading,
  Stack,
  Switch,
  Text,
  useMediaQuery,
} from "@chakra-ui/react";
import Link from "next/link";
import { IoMdPricetag } from "react-icons/io";
import { canSSRAuth } from "../../utils/canSSRAuth";
import { setupAPIClient } from "../../services/api";
import { ChangeEvent, useState } from "react";

interface HaircutsItem {
  id: string;
  name: string;
  price: number | string;
  status: boolean;
  user_id: string;
}

interface HaircutsProps {
  haircuts: HaircutsItem[];
}

export default function Haircuts({ haircuts }: HaircutsProps) {
  const [isMobile] = useMediaQuery("(max-width: 500px)");
  const [haircutsList, setHaircutsList] = useState<HaircutsItem[]>(
    haircuts || []
  );
  const [disableHaircut, setDisableHaircut] = useState("enabled");

  async function handleDisable(e: ChangeEvent<HTMLInputElement>) {
    const apiClient = setupAPIClient();

    if (e.target.value === "disabled") {
      setDisableHaircut("enabled");

      const response = await apiClient.get("/haircut/list", {
        params: {
          stauts: true,
        },
      });

      setHaircutsList(response.data);
    } else {
      setDisableHaircut("disabled");

      const response = await apiClient.get("/haircut/list", {
        params: {
          stauts: false,
        },
      });

      setHaircutsList(response.data);
    }
  }

  return (
    <>
      <Head>
        <title>Cortes - BarberPRO</title>
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
            mb={0}
          >
            <Heading
              fontSize={isMobile ? "28px" : "3xl"}
              mt={4}
              mb={4}
              mr={4}
              color="orange.900"
            >
              Modelos de corte
            </Heading>

            <Link href="/haircuts/new">
              <Button bg="gray.700" _hover={{ bg: "gray.700" }}>
                Cadastrar novo
              </Button>
            </Link>

            <Stack ml="auto" align="center" direction="row">
              <Text fontWeight="bold">Ativos</Text>

              <Switch
                colorScheme="green"
                size="lg"
                value={disableHaircut}
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  handleDisable(e)
                }
                isChecked={disableHaircut === "disabled" ? false : true}
              />
            </Stack>
          </Flex>

          {haircutsList.map((item) => (
            <Link href={`/haircuts/${item.id}`} key={item.id}>
              <Flex
                w="68vw"
                direction={isMobile ? "column" : "row"}
                p={6}
                rounded={4}
                mb={4}
                bg="barber.400"
                justify="space-between"
                align={isMobile ? "flex-start" : "center"}
                cursor="pointer"
              >
                <Flex
                  mb={isMobile ? 2 : 0}
                  direction="row"
                  alignItems="center"
                  justifyContent="center"
                >
                  <IoMdPricetag size={28} color="#fba931" />
                  <Text fontWeight="bold" ml={4} noOfLines={1} color="white">
                    {item.name}
                  </Text>
                </Flex>

                <Text fontWeight="bold" color="white">
                  Preço: R$ {Number(item.price).toFixed(2)}
                </Text>
              </Flex>
            </Link>
          ))}
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
