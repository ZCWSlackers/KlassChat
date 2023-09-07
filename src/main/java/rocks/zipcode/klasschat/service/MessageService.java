package rocks.zipcode.klasschat.service;

import java.util.LinkedList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import rocks.zipcode.klasschat.domain.Message;
import rocks.zipcode.klasschat.domain.User;
import rocks.zipcode.klasschat.repository.MessageRepository;
import rocks.zipcode.klasschat.repository.UserRepository;
import rocks.zipcode.klasschat.service.dto.MessageDTO;
import rocks.zipcode.klasschat.service.dto.UserDTO;
import rocks.zipcode.klasschat.service.mapper.MessageMapper;

/**
 * Service Implementation for managing {@link Message}.
 */
@Service
@Transactional
public class MessageService {

    private final Logger log = LoggerFactory.getLogger(MessageService.class);

    private final MessageRepository messageRepository;

    //    private final UserRepository userRepository;
    private final MessageMapper messageMapper;

    public MessageService(MessageRepository messageRepository, UserRepository userRepository, MessageMapper messageMapper) {
        this.messageRepository = messageRepository;
        //        this.userRepository = userRepository;
        this.messageMapper = messageMapper;
    }

    /**
     * Save a message.
     *
     * @param messageDTO the entity to save.
     * @return the persisted entity.
     */
    public MessageDTO save(MessageDTO messageDTO) {
        log.debug("Request to save Message : {}", messageDTO);
        Message message = messageMapper.toEntity(messageDTO);
        message = messageRepository.save(message);
        return messageMapper.toDto(message);
    }

    /**
     * Update a message.
     *
     * @param messageDTO the entity to save.
     * @return the persisted entity.
     */
    public MessageDTO update(MessageDTO messageDTO) {
        log.debug("Request to update Message : {}", messageDTO);
        Message message = messageMapper.toEntity(messageDTO);
        message = messageRepository.save(message);
        return messageMapper.toDto(message);
    }

    /**
     * Partially update a message.
     *
     * @param messageDTO the entity to update partially.
     * @return the persisted entity.
     */
    public Optional<MessageDTO> partialUpdate(MessageDTO messageDTO) {
        log.debug("Request to partially update Message : {}", messageDTO);

        return messageRepository
            .findById(messageDTO.getId())
            .map(existingMessage -> {
                messageMapper.partialUpdate(existingMessage, messageDTO);

                return existingMessage;
            })
            .map(messageRepository::save)
            .map(messageMapper::toDto);
    }

    /**
     * Get all the messages.
     *
     * @return the list of entities.
     */
    @Transactional(readOnly = true)
    public List<MessageDTO> findAll() {
        log.debug("Request to get all Messages");
        return messageRepository.findAll().stream().map(messageMapper::toDto).collect(Collectors.toCollection(LinkedList::new));
    }

    //    public List<MessageDTO> mergeUsers(List<MessageDTO> msgList) {
    //        for (int i = 0; i < msgList.size(); i++) {
    //           Long userId = msgList.get(i).getUser().getId();
    //           User tempUser = userRepository.getById(userId);
    //           UserDTO tempDTO = new UserDTO(tempUser);
    //
    //           msgList.get(i).setUser(tempDTO);
    //        }
    //
    ////        for (MessageDTO msg : msgList) {
    ////            log.warn(":"+msg.getUser().getId());
    ////        }
    //        return msgList;
    //    }
    /**
     * Get one message by id.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    @Transactional(readOnly = true)
    public Optional<MessageDTO> findOne(Long id) {
        log.debug("Request to get Message : {}", id);
        return messageRepository.findById(id).map(messageMapper::toDto);
    }

    /**
     * Delete the message by id.
     *
     * @param id the id of the entity.
     */
    public void delete(Long id) {
        log.debug("Request to delete Message : {}", id);
        messageRepository.deleteById(id);
    }

    @Transactional(readOnly = true)
    public List<MessageDTO> findByChannelId(Long channelId) {
        log.debug("Request to get Messages by Channel ID: {}", channelId);
        return messageRepository.findByChannelId(channelId).stream().map(messageMapper::toDto).collect(Collectors.toList());
    }
}
