package rocks.zipcode.klasschat.service.mapper;

import java.util.Set;
import java.util.stream.Collectors;
import org.mapstruct.*;
import rocks.zipcode.klasschat.domain.Channel;
import rocks.zipcode.klasschat.domain.User;
import rocks.zipcode.klasschat.domain.Workspace;
import rocks.zipcode.klasschat.service.dto.ChannelDTO;
import rocks.zipcode.klasschat.service.dto.UserDTO;
import rocks.zipcode.klasschat.service.dto.WorkspaceDTO;

/**
 * Mapper for the entity {@link Channel} and its DTO {@link ChannelDTO}.
 */
@Mapper(componentModel = "spring")
public interface ChannelMapper extends EntityMapper<ChannelDTO, Channel> {
    @Mapping(target = "workspace", source = "workspace", qualifiedByName = "workspaceId")
    @Mapping(target = "users", source = "users", qualifiedByName = "userIdSet")
    ChannelDTO toDto(Channel s);

    @Mapping(target = "removeUser", ignore = true)
    Channel toEntity(ChannelDTO channelDTO);

    @Named("workspaceId")
    @BeanMapping(ignoreByDefault = true)
    @Mapping(target = "id", source = "id")
    WorkspaceDTO toDtoWorkspaceId(Workspace workspace);

    @Named("userId")
    @BeanMapping(ignoreByDefault = true)
    @Mapping(target = "id", source = "id")
    UserDTO toDtoUserId(User user);

    @Named("userIdSet")
    default Set<UserDTO> toDtoUserIdSet(Set<User> user) {
        return user.stream().map(this::toDtoUserId).collect(Collectors.toSet());
    }
}
