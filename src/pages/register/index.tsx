import Head from "next/head";
import Image from "next/image";
import { Flex, Text, Center, Input, Button } from "@chakra-ui/react";
import logoImg from "../../../public/images/logo.svg";
import Link from "next/link";
import { useContext, useState } from "react";
import { AuthContext } from "../../contexts/AuthContext";
import { canSSRGuest } from "../../utils/canSSRGuest";

export default function Register() {
  const { signUp } = useContext(AuthContext);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function handleRegister() {
    if (name === "" || email === "" || password === "") {
      return;
    }

    await signUp({ name, email, password });
  }

  return (
    <>
      <Head>
        <title>BarberPRO - Cadastro</title>
      </Head>

      <Flex
        background="barber.900"
        height="100vh"
        alignItems="center"
        justifyContent="center"
      >
        <Flex width={520} direction="column" p={14} rounded={8}>
          <Center p={4}>
            <Image src={logoImg} quality={100} alt="Logo" width={240} />
          </Center>

          <Input
            background="barber.400"
            variant="filled"
            size="lg"
            placeholder="Nome"
            type="text"
            mb={4}
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <Input
            background="barber.400"
            variant="filled"
            size="lg"
            placeholder="Email"
            type="email"
            mb={4}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <Input
            background="barber.400"
            variant="filled"
            size="lg"
            placeholder="******"
            type="text"
            mb={6}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <Button
            background="button.cta"
            mb={6}
            color="gray.900"
            size="lg"
            _hover={{ bg: "#ffb13e" }}
            onClick={handleRegister}
          >
            Cadastrar
          </Button>

          <Center mt={2}>
            <Link href="/">
              <Text cursor="pointer">
                Já possui uma conta? <strong>Faça login!</strong>
              </Text>
            </Link>
          </Center>
        </Flex>
      </Flex>
    </>
  );
}

export const getServerSideProps = canSSRGuest(async (ctx) => {
  return {
    props: {},
  };
});
