package rocks.zipcode.klasschat.service.mapper;

import org.mapstruct.*;
import rocks.zipcode.klasschat.domain.Channel;
import rocks.zipcode.klasschat.domain.Message;
import rocks.zipcode.klasschat.domain.User;
import rocks.zipcode.klasschat.service.dto.ChannelDTO;
import rocks.zipcode.klasschat.service.dto.MessageDTO;
import rocks.zipcode.klasschat.service.dto.UserDTO;

/**
 * Mapper for the entity {@link Message} and its DTO {@link MessageDTO}.
 */
@Mapper(componentModel = "spring")
public interface MessageMapper extends EntityMapper<MessageDTO, Message> {
    @Mapping(target = "user", source = "user", qualifiedByName = "userId")
    @Mapping(target = "channel", source = "channel", qualifiedByName = "channelId")
    MessageDTO toDto(Message s);

    @Named("userId")
    @BeanMapping(ignoreByDefault = true)
    @Mapping(target = "id", source = "id")
    UserDTO toDtoUserId(User user);

    @Named("channelId")
    @BeanMapping(ignoreByDefault = true)
    @Mapping(target = "id", source = "id")
    ChannelDTO toDtoChannelId(Channel channel);
}
