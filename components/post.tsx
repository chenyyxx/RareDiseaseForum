import Image from 'next/image';
import {
  Box,
  Center,
  Heading,
  Text,
  HStack,
  StackDivider,
  Stack,
  Avatar,
  useColorModeValue,
  VStack,
  Button,
  Flex,
  Link,
  Textarea,
} from '@chakra-ui/react';

import { TriangleUpIcon, TriangleDownIcon } from '@chakra-ui/icons'
import {BiCommentDetail, BiShare ,BiBookmark} from "react-icons/bi";
import RichTextEditor from './RichText'
import { useState } from 'react';
import { useSession } from 'next-auth/react';

interface Post {
  id: number,
  title: string,
  body: string
}



function Post({post}: {post: Post}) {
  const [showEditor, setShowEditor] = useState(false)
  const [content, setContent] = useState('')
  const { data: session, status } = useSession()
  const createdAt = new Date(post.updatedAt)
  const date = createdAt.getDate()
  const year = createdAt.getFullYear()
  const month = createdAt.getMonth()
  // const parser = new DOMParser()
  // this parse the html content into text to display only abstract of content in post
  const postContent = post.content.replace(/<[^>]+>/g, '') 
  // console.log(postContent)
  const handleNewComment = async (e) => {
    e.preventDefault();
    setShowEditor(false)
    const newComment = {
        postId: post.id,
        content: content,
        user: session?.user
    }
    if(content==""){
        alert("comment content cannot be empty")
    } else {
        await fetch("/api/create_comment", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(newComment),
        })
        setContent("")
    }
}
  return (
    
    // <Center>
      <Box
        w={'full'}
        bg={useColorModeValue('white', 'gray.900')}
        boxShadow={'2xl'}
        rounded={'md'}
        p={6}
        overflow={'hidden'}>
        {
          <Stack>
            // title row
            <Heading
              as={'a'} href={`/post/${post.id}`}
              color={useColorModeValue('gray.700', 'white')}
              fontSize={'2xl'}
              fontFamily={'body'}>
              {post.title}
            </Heading>
            // user row
            <HStack justify={"space-between"} align="center">
                <HStack>
                  <Avatar
                    size="sm"
                    src={post.user.image}
                  />
                  <Text fontSize={'sm'} fontWeight={600}>{post.user.name}</Text>
                  <Text fontSize={'xs'} color={'gray.500'}>{`${month}-${date}-${year}`}</Text> 
                </HStack>
                <Text
                  as={Link}
                  href={`/sections/${post.section?.id}`}
                  color={'green.500'}
                  textTransform={'uppercase'}
                  fontWeight={800}
                  fontSize={'sm'}
                  letterSpacing={1.1}>
                  {post.section?.name}
                </Text>
            </HStack>
            
            // body
            <Box as={'a'} href={`/post/${post.id}`}>
              <Text fontSize={'sm'} noOfLines={3}>
                {postContent}
              </Text>
              {/* <RichTextEditor
                readOnly
                value={post.content}
                onChange={()=>{}} 
                styles={{root: { border: 'none'}}}
                sx={()=> ({
                  '& .ql-editor': {
                    padding: '0px 0px'
                  },
                })}

              /> */}
            </Box>
            
            // action row
            <HStack justify={"space-between"}>
              <HStack spacing='24px' divider={<StackDivider borderColor='gray.200' />}>
                <HStack>
                  <TriangleUpIcon color='teal.500' />
                  <Text fontSize={'sm'} color={'gray.500'}>
                    688
                  </Text>
                </HStack>
                <HStack>
                  <TriangleDownIcon color='red.500' />
                  <Text fontSize={'sm'} color={'gray.500'}>
                      23
                    </Text>
                </HStack>
              </HStack>
              <HStack spacing={0}>
                <Button size='sm' variant='ghost' onClick={()=>{setShowEditor(true)}} leftIcon={<BiCommentDetail/>}>5.8k comments</Button>
                <Button size='sm' variant='ghost' leftIcon={<BiShare/>}>Share</Button>
                <Button size='sm' variant='ghost' leftIcon={<BiBookmark/>}>Save</Button>
              </HStack>
            </HStack>
            {
              showEditor ?
              <Box mt="12px">
                  <RichTextEditor 
                      controls={[
                          ['bold', 'italic', 'underline', 'link'],
                          ['unorderedList', 'h1', 'h2', 'h3'],
                          ['sup', 'sub'],
                          ['alignLeft', 'alignCenter', 'alignRight'],
                      ]}
                      styles={{
                          root: { 
                              borderColor: '#E2E8F0',
                              borderRadius: '0.375rem',
                              minHeight: '200px',
                          },
                          toolbar: { borderColor: '#E2E8F0' },
                      }}
                      value={content} 
                      onChange={setContent} 
                  />
                  <HStack pt='12px' justify="right" w="full">
                      <Button size='sm'  onClick={()=>setShowEditor(false)}>Cancel</Button>
                      <Button  size='sm' colorScheme="teal" onClick={e=>handleNewComment(e)} >Comment</Button>
                  </HStack>
                      
              </Box>  
              :
              <></>
            }
          </Stack>
        }
      </Box>
  );
}



export default Post